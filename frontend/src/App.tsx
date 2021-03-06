import * as React from "react";
import {useState} from "react";
import {Team} from "./team/Team";
import {Signup} from "./Signup";
import {Estimator} from "./estimate/Estimator";
import io from "socket.io-client";
import {conf} from "./config";
import {useEffect} from "react";


export interface TeamWithVotes {
    [index: string]: number
}

const setupTeam = (socket: any) => {
    const [team, setTeam] = useState<TeamWithVotes>();

    return {
        joinTeam: (name: string) => {
            if (socket) {
                socket.emit("join-team", {name})
            }
        },
        team,
        socket,
        setTeam
    }
};

export const App = () => {
    const [name, setName] = useState<string>();
    const [estimate, setEstimate] = useState<number | "consensus not reached">();
    const [webSocket, setWebSocket] = useState<SocketIOClient.Socket>();

    const {joinTeam, team, socket, setTeam} = setupTeam(webSocket);

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const socket: SocketIOClient.Socket = io(conf.socketRoute, {transports: ["websocket"]});

        socket.on("clear-points", (msg: TeamWithVotes, success: Function) => {
            setTeam(msg);
            setEstimate(undefined);
            success && success(true)
        });

        socket.on("team-updated", (msg: TeamWithVotes, success: Function) => {
            setTeam(msg);
        });

        socket.on("estimation-completed", (msg: { estimate: number }, success: Function) => {
            setEstimate(msg.estimate);
            success && success(true)
        });

        socket.on("consensus-not-reached", (msg: TeamWithVotes, success: Function) => {
            setTeam(msg);
            setEstimate("consensus not reached");
            success && success(true)
        });

        socket.on("team-joined", (data: TeamWithVotes, success: Function) => {
            setTeam(data);
            setLoggedIn(true);
            success && success(true);
        });

        socket.on("story-pointed", (team: TeamWithVotes, success: Function) => {
            setTeam(team);
            success && success(true)
        });

        setWebSocket(socket);
    }, []);

    const point = (point: number) => {
        socket.emit("point-story", {name, point});
    };

    const saveName = (name: string) => {
        setName(name);
    };

    const pointAgain = () => {
        socket.emit("point-another-story")
    };

    return <div>
        {loggedIn ?
            <>
                <Team team={team} estimationComplete={estimate !== undefined} name={name}/>
                <Estimator point={point} finalEstimate={estimate} pointAgain={pointAgain}/>
            </>
            :
            <Signup joinTeam={joinTeam} saveName={saveName} name={name}/>
        }
    </div>
};