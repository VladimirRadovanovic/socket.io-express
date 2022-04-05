import { useState } from "react";

import socket from "../../socket";
import StatusIcon from "./StatusIcon";
import './MessagePanel.css'
import { useEffect } from "react";

function MessagePanel({ user, selectedMessages, setSelectedMessage }) {
    const [message, setMessage] = useState('')
    // const [length, setLength] = useState(user.messages.length)
    console.log(selectedMessages, 'selected messages')






    // const [sentMessages, setSentMessages] = useState([])

    // console.log('sent messages', sentMessages)

    // console.log(user?.messages, ' selected user messages')


    const onMessage = (e) => {
        setMessage(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if(user) {
            socket.emit('private message', {
                content: message,
                to: user.userID
            })
            user?.messages?.push({
                content: message,
                fromSelf: true
            })
            // setSentMessages(user?.messages)
            // setSelectedMessage(m => [...m, {content: message, fromSelf: true}])
        }
        console.log(user?.messages, 'messages user')
        setSelectedMessage([...user.messages])

        setMessage('')
    }

    const displaySender = (message, index) => {
        return (
            index === 0 ||
            user?.messages[index - 1]?.fromSelf !==
            user?.messages[index]?.fromSelf
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
                {selectedMessages?.map((message, index) => (
                    <li className="message" key={index}>
                            {displaySender(message, index) && (
                                <div className="sender">
                                    {message.fromSelf ? "(yourself)" : user.username}
                                </div>
                            )}
                            {/* {length} */}
                            {message.content}
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
                <button disabled={!isValid} className='send-button'>Send</button>
            </form>
        </div>
    )

}

export default MessagePanel;
