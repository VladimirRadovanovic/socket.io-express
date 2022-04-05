import { useState, useEffect } from "react";

import socket from "../../socket";
import User from "./User";
import MessagePanel from "./MessagePanel";
import './Chat.css'

function Chat() {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)

    const [selectedMessages, setSelectedMessage] = useState([])
    console.log(selectedMessages, 'compare messages')
    // console.log(message, 'message from user')


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
        setSelectedMessage(user.messages)
        user.hasNewMessages = false
    }



          useEffect(() => {


    // useEffect(() => {
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

        socket.on("users", (use) => {

            use.forEach(user => {
                user.self = user.userID === socket.id;
                initReactiveProperties(user);
            })

            use = use.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            setUsers(use)
        })

        socket.on('user connected', user => {
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
                console.log(user.messages,'mmmmmm')
                setSelectedMessage([...user.messages])
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
        <div>
            <div className="left-panel">
            {users.map(user => (
                <User key={user.userID} user={user} selected={selectedUser === user} select={onSelectUser} />
            ))}
            </div>
            {selectedUser && (
                <MessagePanel user={selectedUser} selectedMessages={selectedMessages} setSelectedMessage={setSelectedMessage} />
            )
            }
        </div>
    )
}

export default Chat;
