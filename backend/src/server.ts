import {Socket} from "socket.io";
import {Server} from "socket.io";

type NameToPointer = { [index: string]: number };
let teamEstimates: NameToPointer = {};

function consensusReached() {
    let estimateSet: { [index: number]: number } = {};
    Object.values(teamEstimates).forEach(estimate => {
        estimateSet = {
            ...estimateSet,
            [estimate]: estimateSet[estimate] ? estimateSet[estimate]++ : 0,
        }
    });
    return Object.keys(estimateSet).length === 1;
}

function allVotesAreIn() {
    return !Object.values(teamEstimates).includes(null);
}

function joinTheTeam(msg: any, socket: Socket, server: Server) {
    teamEstimates = {
        [msg.name]: null,
        ...teamEstimates,
    };
    socket.emit("team-joined", teamEstimates);
    server.sockets.emit("team-updated", teamEstimates);
}

function pointTheStory(msg: any) {
    teamEstimates = {
        ...teamEstimates,
        [msg.name]: msg.point,
    };
}

export const start = (socketServer: Server) => {
    socketServer.on("connection", (socket) => {
        socket.on("join-team", (msg) => {
            joinTheTeam(msg, socket, socketServer);
        });

        socket.on("point-story", (msg) => {
            pointTheStory(msg);

            if (allVotesAreIn() && consensusReached()) {
                socketServer.sockets.emit("estimation-completed", {estimate: teamEstimates[msg.name]})
            } else if (allVotesAreIn()) {
                socketServer.sockets.emit("consensus-not-reached", teamEstimates)
            }
            socketServer.sockets.emit("story-pointed", teamEstimates);
        });

        socket.on("point-another-story", () => {
            Object.keys(teamEstimates).map(teamMember => {
                teamEstimates = {
                    ...teamEstimates,
                    [teamMember]: null,
                }
            });

            socketServer.sockets.emit("clear-points", teamEstimates)
        })
    });
};