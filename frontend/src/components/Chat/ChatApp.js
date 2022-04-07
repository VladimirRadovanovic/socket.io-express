import { useState, useEffect } from "react";

import socket from "../../socket";
import Chat from "./Chat";
import SelectUsername from "./SelectUsername";
import { useSocket } from "../../context/SocketProvider";

function ChatApp({ user }) {
    const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false)
    const socket = useSocket()
console.log(socket, 'socket@@@@@@@@@@@@')
    // const [errors, setErrors] = useState([])
    // useEffect(() => {
    //     const sessionID = localStorage.getItem("sessionID");
    //     console.log(sessionID, 'sessionID@@@@@@@@##########')
    //     if (sessionID) {
    //         // this.usernameAlreadySelected = true;
    //         socket.auth = { sessionID, 'username': user.username };
    //         socket.connect();
    //     }
    //     // console.log(' am I connecting????????????')

    //     // socket.on("session", ({ sessionID, userID }) => {
    //     //     // attach the session ID to the next reconnection attempts
    //     //     socket.auth = { sessionID };
    //     //     // store it in the localStorage
    //     //     localStorage.setItem("sessionID", sessionID);
    //     //     // save the ID of the user
    //     //     socket.userID = userID;
    //     // });

    //     return () => {
    //         socket.disconnect()
    //     }
    // }, [user])

    // useEffect(() => {
    //     socket.auth = { 'username': user?.username }
    //     socket.connect()

    // }, [user, socket, user?.username])


    // const onUsernameSelection = (username) => {
    //     setUsernameAlreadySelected(true)
    //     socket.auth = { username }
    //     socket.connect()
    // }

    const setUsernameFalse = () => {
        setUsernameAlreadySelected(false)
    }

    const setUsernameTrue = () => {
        setUsernameAlreadySelected(true)
    }

    // // Need to restructure!!!!!!
    // useEffect(() => {
    //     socket.on('connection_error', (err) => {
    //         if(err.message === "invalid username") {
    //             setUsernameAlreadySelected(false)
    //             setErrors([errors.message])
    //         }
    //     })
    //     return () => {
    //         socket.off("connect_error");
    //     }
    // }, [])

    return (
        <div>
            {/* <ul>
                {errors.map(error => (
                    <li key={error}>{error}</li>
                ))}
            </ul> */}
            {socket && <Chat user={user} socket={socket} />}
        </div>
    )
}

export default ChatApp;
