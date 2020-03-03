import * as React from "react";
import {useState} from "react";
import io from "socket.io-client";
import {conf} from "./config";
import {Team} from "./team/Team";


export const App = () => {
    const socket: SocketIOClient.Socket = io(conf.socketRoute, {transports: ["websocket", "polling"]});

    socket.on("team-joined", (data: unknown, success: Function) => {
        setTeam(true);
        success(true);
    });

    const [name, setName] = useState(undefined);
    const [team, setTeam] = useState(false);

    const saveName = (name: string) => {
        setName(name);
    };

    const submitName = (name: string) => {
        if (socket) {
            socket.emit("name-added", {name})
        }
    };

    return <div>
        {team ?
            <Team/>
            :
            <form className="save" onSubmit={(e) => {
                e.preventDefault();
                submitName(name);
            }}>
                <input className="name" onChange={(e) => saveName(e.target.value)}/>
                <button onSubmit={(e) => {
                    submitName(name);
                    e.preventDefault();
                }}>Submit
                </button>
            </form>
        }
    </div>
};