
import { useSelector } from "react-redux";


import './User.css'
import StatusIcon from "./StatusIcon";

function User({ user, selected, select, newMsg }) {

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
