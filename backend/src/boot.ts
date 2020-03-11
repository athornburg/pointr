import io from "socket.io"
import {start} from "./server";
const port = 3000;
const server = io(port, {serveClient: false, transports: ["websocket", "polling"]});

start(server);