import io from "socket.io"
const port = 3000;
const server = io(port, {serveClient: false});

server.on("connection", (socket) => {
    socket.emit("greeting", {greeting: `Hello ${Math.random()}`})
});