import { io } from "socket.io-client";


const socket = io({ autoConnect: false });


socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  export default socket;
