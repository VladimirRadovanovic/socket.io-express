import { useState } from "react";

// import socket from "../../socket";
import StatusIcon from "./StatusIcon";
import './MessagePanel.css'
import { useEffect } from "react";
import { useSocket } from "../../context/SocketProvider";

function MessagePanel({ user, selectedMessages, setSelectedMessage, fromUser, toUser, socket }) {
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    // const [length, setLength] = useState(user.messages.length)





    // const socket = useSocket()




    // const [sentMessages, setSentMessages] = useState([])

    // console.log('sent messages', sentMessages)

    // console.log(user?.messages, ' selected user messages')



    const onMessage = (e) => {
        setMessage(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if(user) {
            // console.log(user, 'user')
            socket.emit('private message', {
                content: message,
                to: user.privateChatRoomID
            })
            // user?.messages?.push({
            //     content: message,
            //     fromSelf: true
            // })
            // setSentMessages(user?.messages)
            // setSelectedMessage(m => [...m, {content: message, fromSelf: true}])
        }
        // console.log(user?.messages, 'messages user')
        // setChatMessages(prevM => [...prevM, ])

        setMessage('')
    }

    // const displaySender = (message, index) => {
    //     console.log(index,
    //         selectedMessages[index -1]?.from,
    //         selectedMessages[index]?.from, 'display sender', selectedMessages)
    //     return (
    //         index === 0 ||
    //         selectedMessages[index -1]?.from !==
    //         selectedMessages[index]?.from
    //     )
    // }

    // const isValid = () => {
    //     return message.length > 0
    // }


    return (
        <div className="right-panel">
            <div className="header">
                <StatusIcon connected={user.connected} /> {user.username}
            </div>
            <ul className="messages">
                {selectedMessages?.map((message, index) => (
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
