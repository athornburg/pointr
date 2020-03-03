import * as React from "react";
import io from "socket.io"
import {App} from "../App";
import {mount, ReactWrapper} from "enzyme";
import {Team} from "../team/Team";
import {act} from "react-dom/test-utils";
import {conf} from "../config";

describe("App", () => {
    let server: SocketIO.Server;
    let connection: Promise<string>;

    beforeEach(async () => {
        conf.socketRoute = "http://localhost:3333";
        server = io(3333, {transports: ["websocket", "polling"]});

        connection = new Promise((resolve) => {
            server
                .on("connection", (socket) => {
                    socket.on("name-added", () => {
                        socket.emit("team-joined", {}, () => {
                            resolve();
                        });
                    });
                })
        });
    });

    afterEach(() => {
        server.close();
    });

    it('should join a team', async () => {
        const app: ReactWrapper = await mount(<App/>);

        app.find(".name")
            .simulate('change', {
                target: {value: 'Alex'}
            });


        app.find(".save").simulate("submit");

        await act(async () => {
            await connection;

            app.update();
        });

        expect(app.find(Team).exists()).toBe(true);
        expect(app.find(".name").exists()).toBe(false);
    });
});