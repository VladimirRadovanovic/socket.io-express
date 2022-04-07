import { useState, useEffect } from "react";
import { useSelector } from "react-redux";


import './User.css'
import StatusIcon from "./StatusIcon";

function User({ user, selected, select, newMessage, messagedUser, newMsg }) {
    // use use selector to determine if the user is sessionUser
    const sessionUser = useSelector(state => state.session.user)
    // const [newMessage, setNewMessage] = useState(null)
    console.log(newMessage, sessionUser, user, 'has private message!!!!!!! rendering user component')
    // useEffect(() => {
    //     if(user.hasNewMessage) {
    //         setNewMessage(user.hasNewMessage)
    //     }
    // }, [user.hasNewMessage])
    // const findUser = () => {
    //     const foundUser = users.find(u => u.privateChatRoomID === newMessage.from)
    //     console.log(foundUser, '***********!!!!!!!!!!!!!!!found user')
    //     return foundUser.privateChatRoomID

    // }

    return (
        <div onClick={() => select(user)} className={selected ? 'selected' : ''}>
            <div className="description">
                <span className="name">
                    {user.username} {user.privateChatRoomID === sessionUser.privateChatRoomID ? " (yourself)" : ""}
                </span>
                <span className="status">
                    <StatusIcon connected={user.connected ? "online" : "offline"} />
                </span>
                {newMsg && (
                    <span className="new-message">
                        !
                    </span>
                )}
            </div>
        </div>
    )
}

export default User;
