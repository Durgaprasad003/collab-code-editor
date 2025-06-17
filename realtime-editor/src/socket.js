import { io } from "socket.io-client";

let socket ;

export const initsocket = async () => {
  socket = io('https://collab-code-editor-m4lr.onrender.com/', {
    'force new connection':true,
    transports: ["websocket"], // use websocket only
    reconnectionAttempts: 5,   // try to reconnect 5 times
    timeout: 10000,            // wait 10 seconds before failing
    forceNew: true
  }

);

  return socket;
};
