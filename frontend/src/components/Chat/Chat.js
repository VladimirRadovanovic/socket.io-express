import { useState, useEffect } from "react";

import socket from "../../socket";

function Chat() {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [message, setMessage] = useState('')


    const onMessage = (e) => {
        if(selectedUser) {
            socket.emit('private message', {
                content: message,
                to: selectedUser.userID
            })
            selectedUser.messages.push({
                content: message,
                fromSelf: true
            })
        }
    }


    const onSelectUser = (user) => {
        setSelectedUser(user)
        user.hasNewMessages = false
    }


    useEffect(() => {
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

        const initReactiveProperties = (user) => {
            user.connected = true;
            user.messages = [];
            user.hasNewMessages = false;
        };

        socket.on('users', (users) => {
            users.forEach(user => {
                user.self = user.userID === socket.id;
                initReactiveProperties(user);
            })

            users = users.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
        })

        socket.on('user connected', user => {
            initReactiveProperties(user)
            setUsers(users => [...users, user])
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

        socket.on("private message", ({ content, from }) => {
            for (let i = 0; i < users.length; i++) {
              const user = users[i];
              if (user.userID === from) {
                user.messages.push({
                  content,
                  fromSelf: false,
                });
                if (user !== selectedUser) {
                  user.hasNewMessages = true;
                }
                break;
              }
            }
          });

          return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("users");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off("private message");
          }
    }, [])



    return (
        <>
        </>
    )
}

export default Chat;
