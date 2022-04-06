import { useState, useEffect } from "react";

import socket from "../../socket";
import User from "./User";
import MessagePanel from "./MessagePanel";
import './Chat.css'

function Chat({ user }) {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    console.log(users, 'users))))))))))))')

    const [selectedMessages, setSelectedMessage] = useState([])
    const [fromUser, setFromUser] = useState(null)
    const [toUser, setToUser] = useState(null)
    // console.log(selectedMessages, toUser, 'compare messages')
    // console.log(message, 'message from user')


    // useEffect(() => {
    //     socket.auth = { 'username': user?.username }
    //     socket.connect()

    //     return () => {
    //         socket.disconnect()
    //     }
    // }, [])


    // const onMessage = (e) => {
    //     if(selectedUser) {
    //         socket.emit('private message', {
    //             content: message,
    //             to: selectedUser.userID
    //         })
    //         selectedUser.messages.push({
    //             content: message,
    //             fromSelf: true
    //         })
    //     }
    // }


    const onSelectUser = (user) => {

        setSelectedUser(user)
        setSelectedMessage(user?.messages)
        user.hasNewMessages = false
    }



    useEffect(() => {
        const initReactiveProperties = (user) => {
            // user.connected = true;
            console.log('reactive^^^^&&&&&&***************')
            user.messages = [];
            user.hasNewMessages = false;
        };

        socket.on('connect', () => {
            users.forEach(user => {
                if (user.self) {
                    user.connected = true;
                }
            })
        })

        socket.on("disconnect", () => {
            users.forEach((user) => {
                if (user.self) {
                    user.connected = false;
                }
            });
        });



        socket.on("users", (use) => {
            use.forEach(user => {
                for (let i = 0; i < use.length; i++) {
                    console.log('in for each !!!!!!******************', user, use.length)
                    const existingUser = use[i]
                    if (existingUser.userID === user.userID) {
                        existingUser.connected = user.connected;
                        initReactiveProperties(user);
                        // setUsers(u =>[...u, user])
                        return;
                    }
                    user.self = user.userID === socket.userID;
                    console.log('in for each2 !!!!!!******************', user)

                    initReactiveProperties(user);
                    // setUsers([...use])

                }
            })

            use = use.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            console.log(use, 'useeeeeeeee')
            setUsers([...use])
        })

        socket.on('user connected', user => {
            for (let i = 0; i < users.length; i++) {
                const existingUser = users[i];
                if (existingUser.userID === user.userID) {
                  existingUser.connected = true;
                  initReactiveProperties(user)
                //   setUsers(u => [...u, user])
                  console.log('in user connected!!!!!!!!!!!!!!!', user)
                  return;
                }
              }
            initReactiveProperties(user)
            setUsers(u => [...u, user])

        })

        socket.on("user disconnected", (id) => {
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user.userID === id) {
                    user.connected = false;
                    break;
                }
            }
        });

        socket.on("private message", ({ content, from, to }) => {

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const fromSelf = socket.userID === from
                if (user.userID === (fromSelf ? to : from)) {
                    user.messages.push({
                        content,
                        fromSelf
                    });
                    if (user !== selectedUser) {
                        user.hasNewMessages = true;
                    }
                    console.log(user?.messages, 'mmmmmm******MMMMMMMMMMMMM', user)
                    setSelectedMessage([...user?.messages])
                    setFromUser(from)
                    setToUser(to)
                    break;
                }
            }

        });

        socket.on("session", ({ sessionID, userID }) => {
            // attach the session ID to the next reconnection attempts
            socket.auth = { sessionID };
            // store it in the localStorage
            // console.log(sessionID, 'sessionID')
            localStorage.setItem("sessionID", sessionID);
            // save the ID of the user
            socket.userID = userID;
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("users");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off("private message");
        }
    }, [users, user])






    return (
        <div>
            <div className="left-panel">
                {users.map(user => (
                    <User key={user.userID} user={user} selected={selectedUser === user} select={onSelectUser} />
                ))}
            </div>
            {selectedUser && (
                <MessagePanel user={selectedUser} selectedMessages={selectedMessages} setSelectedMessage={setSelectedMessage} fromUser={fromUser} toUser={toUser} />
            )
            }
        </div>
    )
}

export default Chat;
