import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ user, children }) {

    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io(
            'http://localhost:5000',
            { auth: { 'sessionID': user?.id, 'username': user?.username, 'userID': user?.privateChatRoomID, connected: true } }
        );
        socket?.onAny((event, ...args) => {
            console.log(event, args);
        });
        setSocket(newSocket)
        return () => {
            // socket.on("disconnect", () => {
            //     users.forEach((user) => {
            //         if (user.self) {
            //             user.connected = false;
            //         }
            //     });
            // });

            // newSocket.close()
            newSocket.disconnect()
        }
    }, [user])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
