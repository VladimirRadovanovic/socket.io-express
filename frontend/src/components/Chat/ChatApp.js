import { useState, useEffect } from "react";

import socket from "../../socket";

function ChatApp() {
    const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false)
    const [errors, setErrors] = useState([])

    const onUsernameSelection = (username) => {
        setUsernameAlreadySelected(true)
        socket.auth = { username }
        socket.connect()
    }

    // Need to restructure!!!!!!
    useEffect(() => {
        socket.on('connection_error', (err) => {
            if(err.message === "invalid username") {
                setUsernameAlreadySelected(false)
                setErrors([errors.message])
            }
        })
        return () => {
            socket.off("connect_error");
        }
    }, [])

    return (
        <div>
            <ul>
                {errors.map(error => (
                    <li key={error}>{error}</li>
                ))}
            </ul>
            {usernameAlreadySelected ? <Chat /> : <SelectUsername />}
        </div>
    )
}

export default ChatApp;
