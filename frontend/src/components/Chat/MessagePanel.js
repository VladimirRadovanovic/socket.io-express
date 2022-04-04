import { useState } from "react";

import socket from "../../socket";
import StatusIcon from "./StatusIcon";
import './MessagePanel.css'

function MessagePanel({ user, selectedUser }) {
    const [message, setMessage] = useState('')
    console.log('selected user', selectedUser)


    const onMessage = (e) => {
        setMessage(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if(selectedUser) {
            socket.emit('private message', {
                content: message,
                to: selectedUser.userID
            })
            selectedUser?.messages?.push({
                content: message,
                fromSelf: true
            })
        }
        console.log(selectedUser?.message, 'messages user')
        setMessage('')
    }

    const displaySender = (message, index) => {
        return (
            index === 0 ||
            user.messages[index - 1].fromSelf !==
            user.messages[index].fromSelf
        )
    }

    const isValid = () => {
        return message.length > 0
    }


    return (
        <div className="right-panel">
            <div className="header">
                <StatusIcon connected={user.connected} /> {user.username}
            </div>
            <ul className="messages">
                {user?.messages?.map((message, index) => {
                    <li className="message" key={index}>
                            {displaySender(message, index) && (
                                <div className="sender">
                                    {message.fromSelf ? "(yourself)" : user.username}
                                </div>
                            )}
                            {message.content}
                    </li>
                })}
            </ul>
            <form onSubmit={onSubmit} className="form">
                <textarea
                className="input"
                placeholder="Your message..."
                value={message}
                onChange={onMessage}
                />
                <button disabled={!isValid} className='send-button'>Send</button>
            </form>
        </div>
    )

}

export default MessagePanel;
