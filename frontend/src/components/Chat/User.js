import { useState, useEffect } from "react";


import './User.css'
import StatusIcon from "./StatusIcon";

function User({ user, selected, select }) {
console.log(user, 'user in user.js', selected, 'selected boolean')

    return (
        <div onClick={() => select(user)} className={selected}>
            <div className="description">
                <div className="name">
                    {user.username} {user.self ? " (yourself)" : ""}
                </div>
                <div className="status">
                    <StatusIcon connected={user.connected ? "online" : "offline"} />
                </div>
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
