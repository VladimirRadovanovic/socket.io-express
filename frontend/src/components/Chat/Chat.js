import { useState, useEffect } from "react";


import User from "./User";
import MessagePanel from "./MessagePanel";
import './Chat.css'




function Chat({ user, socket }) {

    const [users, setUsers] = useState([])

    const [selectedUser, setSelectedUser] = useState(null)



    const [emittedMessage, setEmittedMessage] = useState(null)

    const removeNotification = (user, msgInput) => {
        if(emittedMessage?.from === user?.privateChatRoomID && msgInput.length > 0) {
            setEmittedMessage(null)
        }
    }

    const onSelectUser = (user) => {

        setSelectedUser(user)

        socket.emit('user selection', {
            user,
            to: user.privateChatRoomID
        })

        if(emittedMessage?.from === user?.privateChatRoomID) {
            setEmittedMessage(null)
        }
    }



    useEffect(() => {


        socket.on("private message", (message, to) => {
            console.log(message, to, 'please be here messages**************!!!!!!!!!!!!!!!!!!!!!!')

            if (message.from === user?.privateChatRoomID || message.to === user?.privateChatRoomID) {

                if(message.from === user?.privateChatRoomID) {
                    console.log(message, 'rendering emit private message in message component')
                    // setNewMessage(message)
                }
            }

        })
        socket.on('new message', message => {
            console.log('message i n new messag emite ', message,'1!!!!!!!!!!')
            setEmittedMessage(message)
        })


        socket.on("users", (use) => {

            use = use.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });

            setUsers([...use])
        })

        socket.on('user connected', users => {

            setUsers([...users])

        })

        socket.on("user disconnected", (users) => {

            setUsers([...users])
        });


        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("users");
            socket.off("user connected");
            socket.off("user disconnected");
            socket.off('new message');
        }
    }, [users, user])






    return (
        <div>
            <div className="left-panel">
                {users.map(user => (
                    <User key={user.id} user={user} selected={selectedUser === user} select={onSelectUser} users={users} newMsg={emittedMessage?.from === user?.privateChatRoomID} />
                ))}
            </div>
            {selectedUser && (
                <MessagePanel user={selectedUser} socket={socket} users={users} removeNotification={removeNotification} />
            )
            }
        </div>
    )
}

export default Chat;
