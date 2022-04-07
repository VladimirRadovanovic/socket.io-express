import { useState } from "react";

// import socket from "../../socket";
import StatusIcon from "./StatusIcon";
import './MessagePanel.css'
import { useEffect } from "react";

function MessagePanel({ user, socket, removeNotification  }) {
    const [message, setMessage] = useState('')
    const [selectedMessages, setSelectedMessage] = useState([])


    removeNotification(user, message)


    const onMessage = (e) => {
        setMessage(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if(user) {

            socket.emit('private message', {
                content: message,
                to: user.privateChatRoomID
            })

        }

        setMessage('')
    }

    useEffect(() => {

        socket.on('user selection', messages => {
            setSelectedMessage(messages)
        })

        socket.on("private message", (message, to) => {

            if (message.from === user?.privateChatRoomID || message.to === user?.privateChatRoomID) {
                setSelectedMessage(pre => [...pre, message])
                if(message.from === user?.privateChatRoomID) {
                    // setNewMessage(message)
                }
            }

        })
        return () => {
            socket.off("private message");
            socket.off("user selection");
        }
    }, [])

    return (
        <div className="right-panel">
            <div className="header">
                <StatusIcon connected={user.connected ? "online" : "offline"} /> {user.username}
            </div>
            <ul className="messages">
                { selectedMessages?.map((message, index) => (
                    <li className="message" key={index}>
                            {(
                                <div className="sender">
                                    {message.to === user.privateChatRoomID ? "(yourself)" : user.username}
                                </div>
                            )}

                            {message.message}
                    </li>
                ))}
            </ul>
            <form onSubmit={onSubmit} className="form">
                <textarea
                className="input"
                placeholder="Your message..."
                value={message}
                onChange={onMessage}
                />
                <button disabled={message.length === 0} className='send-button'>Send</button>
            </form>
        </div>
    )

}

export default MessagePanel;
