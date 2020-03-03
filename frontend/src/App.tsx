import * as React from "react";
import {useState} from "react";
import io from "socket.io-client";
import {conf} from "./config";
import {Team} from "./team/Team";

const setupTeam = () => {
    const [team, setTeam] = useState(false);
    const socket: SocketIOClient.Socket = io(conf.socketRoute, {transports: ["websocket"]});

    socket.on("team-joined", (data: unknown, success: Function) => {
        setTeam(true);
        success && success(true);
    });

    return {
        joinTeam: (name: string) => {
            if (socket) {
                socket.emit("name-added", {name})
            }
        },
        team
    }
};

export const App = () => {
    const [name, setName] = useState(undefined);

    const saveName = (name: string) => {
        setName(name);
    };

    const {joinTeam, team} = setupTeam();

    return <div>
        {team ?
            <Team/>
            :
            <form className="save" onSubmit={(e) => {
                e.preventDefault();
                joinTeam(name);
            }}>
                <input className="name" onChange={(e) => saveName(e.target.value)}/>
                <button onSubmit={(e) => {
                    joinTeam(name);
                    e.preventDefault();
                }}>Submit
                </button>
            </form>
        }
    </div>
};