import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// import socket from "../../socket";
import User from "./User";
import MessagePanel from "./MessagePanel";
import './Chat.css'




function Chat({ user, socket }) {
    // const socket = useSocket()
//     const socket = useSocket()
// console.log(socket, 'socket@@@@@@@@@@@@')


    const [users, setUsers] = useState([])
    const [allMessages, setAllMessages] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    console.log(allMessages, 'users))))))))))))')

    // const [selectedMessages, setSelectedMessage] = useState([])

    // const [fromUser, setFromUser] = useState(null)
    // const [toUser, setToUser] = useState(null)
    // console.log(selectedMessages, toUser, 'compare messages')



    const onSelectUser = (user) => {

        setSelectedUser(user)
        // const userMessages = allMessages.filter(message => (
        //     user.privateChatRoomID === message.from || selectedUser.privateChatRoomID === message.to
        // ))
        socket.emit('user selection', {
            user,
            to: user.privateChatRoomID
        })
        // setSelectedMessage(userMessages)
        user.hasNewMessages = false
    }



    useEffect(() => {

        // const initReactiveProperties = (user) => {
            // user.connected = true;

            // user.messages = [];
            // user.hasNewMessages = false;
        // };

        // socket.on('connect', () => {
        //     users.forEach(user => {
        //         if (user.self) {
        //             user.connected = true;
        //         }
        //     })
        // })

        // socket.on("disconnect", () => {
        //     users.forEach((user) => {
        //         if (user.self) {
        //             user.connected = false;
        //         }
        //     });
        // });



        socket.on("users", (use) => {
            // use.forEach(user => {
                // user.messages.forEach((message) => {
                //     message.fromSelf = message.from === socket.userID;
                // });
                // for (let i = 0; i < use.length; i++) {
                //     console.log('in for each !!!!!!******************', user, use.length)
                //     const existingUser = use[i]
                //     if (existingUser.userID === user.userID) {
                //         existingUser.connected = user.connected;
                //         existingUser.messages = user.messages;
                //         initReactiveProperties(user);
                //         // setUsers(u =>[...u, user])
                //         return;
                //     }
                //     user.self = user.userID === socket.userID;
                //     console.log('in for each2 !!!!!!******************', user)

                //     initReactiveProperties(user);
                //     // setUsers([...use])

                // }
            // })

            use = use.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });

            setUsers([...use])
        })

        socket.on('user connected', users => {
            // for (let i = 0; i < users.length; i++) {
            //     const existingUser = users[i];
            //     if (existingUser.userID === user.userID) {
            //         existingUser.connected = true;
            //         initReactiveProperties(user)
            //         //   setUsers(u => [...u, user])
            //         console.log('in user connected!!!!!!!!!!!!!!!', user)
            //         return;
            //     }
            // }
            // initReactiveProperties(user)
            setUsers([...users])

        })

        socket.on("user disconnected", (users) => {

            // for (let i = 0; i < users.length; i++) {
            //     const user = users[i];
            //     console.log(user.connected, 'in user disconnected')
            //     if (user.privateChatRoomID === id) {
            //         user.connected = false;
            //         break;
            //     }
            // }
            // const filteredUsers = users.
            setUsers([...users])
        });

        // socket.on("private message", ({ content, from, to }) => {

        //     for (let i = 0; i < users.length; i++) {
        //         const user = users[i];
        //         const fromSelf = socket.userID === from
        //         if (user.userID === (fromSelf ? to : from)) {
        //             user.messages.push({
        //                 content,
        //                 fromSelf
        //             });
        //             if (user !== selectedUser) {
        //                 user.hasNewMessages = true;
        //             }
        //             console.log(user?.messages, 'mmmmmm******MMMMMMMMMMMMM', user)
        //             setSelectedMessage([...user?.messages])
        //             setFromUser(from)
        //             setToUser(to)
        //             break;
        //         }
        //     }

        // });

        // socket.on("private message", (message, to) => {
        //     console.log(message, to, 'please be here messages**************!!!!!!!!!!!!!!!!!!!!!!')

        //     // const msgs = messages.filter(message => (
        //     //     user.privateChatRoomID === message.from && selectedUser.privateChatRoomID === message.to
        //     // ))
        //     // console.log( msgs, 'messages and msgs!!!!!!!!!!')
        //     // setSelectedMessage(msgs)
        //     if (message.from === user?.privateChatRoomID || message.to === user?.privateChatRoomID) {

        //         setSelectedMessage(pre => [...pre, message])
        //     }
        // })

        // socket.on("session", ({ sessionID, userID }) => {
            // attach the session ID to the next reconnection attempts
            // socket.auth = { sessionID };
            // store it in the localStorage
            // console.log(sessionID, 'sessionID')
            // localStorage.setItem("sessionID", sessionID);
            // save the ID of the user
            // socket.userID = userID;
        // });
        // socket.on('user selection', messages => {
        //     console.log(messages, 'user selected messages')
        //     setSelectedMessage(messages)
        // })

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("users");
            socket.off("user connected");
            socket.off("user disconnected");
            // socket.off("private message");
            // socket.off("user selection");
        }
    }, [users, user])






    return (
        <div>
            <div className="left-panel">
                {users.map(user => (
                    <User key={user.id} user={user} selected={selectedUser === user} select={onSelectUser} />
                ))}
            </div>
            {selectedUser && (
                <MessagePanel user={selectedUser} socket={socket} />
            )
            }
        </div>
    )
}

export default Chat;
