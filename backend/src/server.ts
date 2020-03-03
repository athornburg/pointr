import io from "socket.io"
const port = 3000;
const server = io(port, {serveClient: false, transports: ["websocket", "polling"]});

server.on("connection", (socket) => {
    socket.on("name-added", () => {
        socket.emit("team-joined", {team: true})
    })
});