import io from "socket.io-client";
import ioServer from "socket.io";
import {start} from "../server";

describe("server", () => {
    let client: SocketIOClient.Socket;
    let server: SocketIO.Server;


    beforeEach(() => {
        client = io("http://localhost:5555");
        server = ioServer(5555, {serveClient: false, transports: ["websocket", "polling"]});

        start(server);

        client.emit("join-team", {name: "alex"});
        client.emit("join-team", {name: "john"});

    });

    afterEach(() => {
        client.close();
        server.close();
    });

    const getTeamResponse = () => {
        return new Promise((resolve) => {
            client.on('team-joined', (msg: any) => {
                resolve(msg)
            })
        });
    };

    it('should join a team', async () => {
        const team = await getTeamResponse();

        const teamAfterJohnJoins = await getTeamResponse();

        expect(await team).toEqual(
            {
                "alex": null,
            }
        );

        expect(await teamAfterJohnJoins).toEqual(
            {
                "alex": null,
                "john": null,
            }
        );
    });

    it('should point the story', async () => {

        client.emit("point-story", {
            name: "alex",
            point: 1,
        });

        const team = new Promise((resolve) => {
            client.on('story-pointed', (msg: any) => {
                resolve(msg)
            })
        });

        expect(await team).toEqual(
            {
                "alex": 1,
                "john": null,
            }
        );
    });

    it('send an estimation when all members have pointed', async () => {

        client.emit("point-story", {
            name: "alex",
            point: 1,
        });

        client.emit("point-story", {
            name: "john",
            point: 1,
        });

        const estimate = new Promise((resolve) => {
            client.on('estimation-completed', (msg: any) => {
                resolve(msg)
            })
        });

        expect(await estimate).toEqual(
            {estimate: 1}
        );
    });

    it('send consensus not reached if folks don\'t agree', async () => {

        client.emit("point-story", {
            name: "alex",
            point: 1,
        });

        client.emit("point-story", {
            name: "john",
            point: 2,
        });

        const estimate = new Promise((resolve) => {
            client.on('consensus-not-reached', (msg: any) => {
                resolve(msg)
            })
        });

        expect(await estimate).toEqual(
            {
                "john": 2,
                "alex": 1.
            }
        );
    });
});