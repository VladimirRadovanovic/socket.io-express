const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');
const crypto = require("crypto");
const { User } = require('./db/models');


const { InMemorySessionStore } = require('./sessionStore');
const { InMemoryMessageStore } = require("./messageStore");

const sessionStore = new InMemorySessionStore()
const messageStore = new InMemoryMessageStore();


const randomId = () => crypto.randomBytes(8).toString("hex");


const http = require('http')
const socketio = require('socket.io')



const routes = require('./routes');



const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: "*",
    }
})


app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());


// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}
// helmet helps set a variety of headers to better secure your app
app.use(helmet({
    contentSecurityPolicy: false
}));

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

app.use(routes);

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});


app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});


// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

io.use((socket, next) => {
    // const sessionID = socket.handshake.auth.sessionID
    // if (sessionID) {
    //     const session = sessionStore.findSession(sessionID)
    //     console.log(session)
    //     if (session) {
    //         socket.sessionID = sessionID
    //         socket.userID = session.userID
    //         socket.username = session.username
    //         return next()
    //     }
    // }

    // const username = socket.handshake.auth.username;
    // console.log(username, 1, sessionID, 2, socket.username, 3, socket.sessionID, 4, socket.handshake.auth, 5, 'dahdahdiuashdiah@@@@@@@@@')
    // if (!username) {
    //     return next(new Error("invalid username"));
    // }
    // socket.sessionID = randomId()
    // socket.userID = randomId()
    // socket.username = username;
    // next();
    socket.sessionID = socket.handshake.auth.sessionID
    socket.userID = socket.handshake.auth.userID
    socket.username = socket.handshake.auth.username
    // socket.connected = socket.handshake.auth.connected
    console.log(socket, socket.sessionID, socket.username, socket.userID, socket.connected)
    next()
});


io.on("connection", async(socket) => {

    // persist session
    // sessionStore.saveSession(socket.sessionID, {
    //     userID: socket.userID,
    //     username: socket.username,
    //     connected: true,
    // });
    socket.connected = true;

    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });

    // join the "userID" room
    socket.join(socket.userID);

    // fetch existing users

    const users = [];

    // const messagesPerUser = new Map();
    // messageStore.findMessagesForUser(socket.userID).forEach((message) => {
    //   const { from, to } = message;
    //   const otherUser = socket.userID === from ? to : from;
    //   if (messagesPerUser.has(otherUser)) {
    //     messagesPerUser.get(otherUser).push(message);
    //   } else {
    //     messagesPerUser.set(otherUser, [message]);
    //   }
    // });

    // sessionStore.findAllSessions().forEach((session) => {
    //     users.push({

    //       userID: session.userID,
    //       username: session.username,
    //       connected: session.connected,
    //       messages: messagesPerUser.get(session.userID) || [],
    //     });

    //   });
    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", {
        userID: socket.userID,
        username: socket.username,
        connected: true,
        messages: [],
    });

    // forward the private message to the right recipient and to other tabs of the sender
    socket.on("private message", ({ content, to }) => {
        const message = {
            content,
            from: socket.userID,
            to,
          }
        socket.to(to).to(socket.userID).emit("private message", message);
        messageStore.saveMessage(message);
    });

    // notify users upon disconnection
    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
          // notify other users
          socket.broadcast.emit("user disconnected", socket.userID);
          // update the connection status of the session
          sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: false,
          });
        }
    });

});

// for testing
io.on('connection', socket => {
    console.log('New WS connection')

    socket.emit('message', 'Welcome to chat')
})


module.exports = {
    server,
    io,
};
