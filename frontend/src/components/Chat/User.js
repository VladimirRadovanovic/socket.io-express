import { useState, useEffect } from "react";
import { useSelector } from "react-redux";


import './User.css'
import StatusIcon from "./StatusIcon";

function User({ user, selected, select }) {
    // use use selector to determine if the user is sessionUser
    const sessionUser = useSelector(state => state.session.user)

    return (
        <div onClick={() => select(user)} className={selected ? 'selected' : ''}>
            <div className="description">
                <span className="name">
                    {user.username} {user.privateChatRoomID === sessionUser.privateChatRoomID ? " (yourself)" : ""}
                </span>
                <span className="status">
                    <StatusIcon connected={user.connected ? "online" : "offline"} />
                </span>
                {user.hasNewMessage && (
                    <div className="new-message">
                        !
                    </div>
                )}
            </div>
        </div>
    )
}

export default User;
