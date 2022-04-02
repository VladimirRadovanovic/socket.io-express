import { useState, useEffect } from "react"

import socket from "../../socket"


function SelectUsername({ setUsernameFalse, setUsernameTrue }) {
    // const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false)
    const [errors, setErrors] = useState([])
    const [username, setUsername] = useState('')

    // const onUsernameSelection = (username) => {
    //     setUsernameAlreadySelected(true)
    //     socket.auth = { username }
    //     socket.connect()
    // }



    // Need to restructure!!!!!!
    useEffect(() => {
        socket.on('connection_error', (err) => {
            if (err.message === "invalid username") {
                // setUsernameAlreadySelected(false)
                setUsernameFalse()
                setErrors([errors.message])
            }
        })
        return () => {
            socket.off("connect_error");
        }
    }, [])

    const isValid = () => {
        return username.length > 2
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        socket.auth = { username }
        socket.connect()
    }

    return (
        <div className="select-username">
            <form onSubmit={handleSubmit}>
            <ul>
                {errors.map(error => (
                    <li key={error}>{error}</li>
                ))}
            </ul>
                    <input
                    placeholder="Your username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    <button disabled={!isValid}>Send</button>
            </form>
        </div>
    )
}

export default SelectUsername;
