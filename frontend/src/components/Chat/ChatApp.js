
import Chat from "./Chat";

import { useSocket } from "../../context/SocketProvider";

function ChatApp({ user }) {

    const socket = useSocket()



    return (
        <div>
            {socket && <Chat user={user} socket={socket} />}
        </div>
    )
}

export default ChatApp;
