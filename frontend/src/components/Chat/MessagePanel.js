import { useState } from "react";

// import socket from "../../socket";
import StatusIcon from "./StatusIcon";
import './MessagePanel.css'
import { useEffect } from "react";
import { useSocket } from "../../context/SocketProvider";

function MessagePanel({ user, socket, setNewMessage, findUser, users, removeNotification  }) {
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [selectedMessages, setSelectedMessage] = useState([])
    // const [newMessage, setNewMessage] = useState(false)
    // const [length, setLength] = useState(user.messages.length)
    // console.log(newMessage, 'message new')



    removeNotification(user, message)

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
    useEffect(() => {

        socket.on('user selection', messages => {
            console.log(messages, 'user selected messages')
            setSelectedMessage(messages)
        })

        socket.on("private message", (message, to) => {
            console.log(message, to, 'please be here messages**************!!!!!!!!!!!!!!!!!!!!!!')

            // const msgs = messages.filter(message => (
            //     user.privateChatRoomID === message.from && selectedUser.privateChatRoomID === message.to
            // ))
            // console.log( msgs, 'messages and msgs!!!!!!!!!!')
            // setSelectedMessage(msgs)
            if (message.from === user?.privateChatRoomID || message.to === user?.privateChatRoomID) {
                setSelectedMessage(pre => [...pre, message])
                if(message.from === user?.privateChatRoomID) {
                    console.log(message, 'rendering emit private message in message component')
                    setNewMessage(message)
                }
            }
            // findUser(users)
        })
        return () => {
            socket.off("private message");
            socket.off("user selection");
        }
    }, [])

    console.log(selectedMessages.length > 0,  selectedMessages[0]?.to ,user.privateChatRoomID , selectedMessages[0]?.from)
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
