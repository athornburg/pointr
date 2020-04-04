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

function joinTheTeam(msg: any, socket: SocketIO.Socket) {
    teamEstimates = {
        [msg.name]: null,
        ...teamEstimates,
    };
    socket.emit("team-joined", teamEstimates)
}

function pointTheStory(msg: any) {
    teamEstimates = {
        ...teamEstimates,
        [msg.name]: msg.point,
    };
}

export const start = (socketServer: SocketIO.Server) => {
    socketServer.on("connection", (socket) => {
        socket.on("join-team", (msg) => {
            joinTheTeam(msg, socket);
        });

        socket.on("point-story", (msg) => {
            pointTheStory(msg);

            if (allVotesAreIn() && consensusReached()) {
                socket.emit("estimation-completed", {estimate: teamEstimates[msg.name]})
            } else if (allVotesAreIn()) {
                socket.emit("consensus-not-reached", teamEstimates)
            }

            socket.emit("story-pointed", teamEstimates);
        });

        socket.on("point-another-story", () => {
            Object.keys(teamEstimates).map(teamMember => {
                teamEstimates = {
                    ...teamEstimates,
                    [teamMember]: null,
                }
            });

            socket.emit("clear-points", teamEstimates)
        })
    });
};