import { useState, useEffect } from "react";

import socket from "../../socket";
import Chat from "./Chat";
import SelectUsername from "./SelectUsername";

function ChatApp({ user }) {
    const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false)

    // const [errors, setErrors] = useState([])
    useEffect(() => {
        socket.auth = { 'username': user?.username }
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [])

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
             <Chat user={user} />
        </div>
    )
}

export default ChatApp;
