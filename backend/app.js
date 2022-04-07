const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');

const { User, Message } = require('./db/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



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

    socket.sessionID = socket.handshake.auth.sessionID
    socket.userID = socket.handshake.auth.userID
    socket.username = socket.handshake.auth.username

    next()
});


io.on("connection", async(socket) => {


    socket.join(socket.userID);

    const user = await User.findByPk(socket.sessionID)
    await user.update({
        connected: true
    })
    const users = await User.findAll()

    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", users);

    // forward the private message to the right recipient and to other tabs of the sender
    socket.on("private message", async({ content, to }) => {

        const message = await Message.create({
            from: socket.userID,
            to,
            message: content,
            userId: socket.sessionID
        })



        io.to(to).to(socket.userID).emit("private message", message, to)
        socket.to(to).emit('new message', message)
    });
    socket.on("user selection", async(user) => {

        const messages = await Message.findAll({
            where: {

                [Op.or]: [{[Op.and]: [{from: socket.userID}, {to: user.user.privateChatRoomID}]}, {[Op.and]: [{from: user.user.privateChatRoomID}, {to: socket.userID}]}]

            }
        })

        io.to(socket.userID).emit("user selection", messages)
    })

    // notify users upon disconnection
    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;

        if (isDisconnected) {

            const user = await User.findByPk(socket.sessionID)
            await user.update({
                connected: false
            })
            const users = await User.findAll()

            socket.broadcast.emit("user disconnected", users);

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
