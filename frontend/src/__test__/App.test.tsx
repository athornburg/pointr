import * as React from "react";
import io, {Server, Socket} from "socket.io"
import {App} from "../App";
import {mount, ReactWrapper} from "enzyme";
import {Team} from "../team/Team";
import {act} from "react-dom/test-utils";
import {conf} from "../config";

describe("App", () => {
    let server: Server;
    let connection: Promise<string>;
    let pointed: Promise<void>;
    let theSocket: Socket;

    beforeEach(async () => {
        conf.socketRoute = "http://localhost:3333";
        server = io(3333, {transports: ["websocket"]});

        pointed = new Promise((resolvePointed) => {
            connection = new Promise((resolveJoinTeam) => {
                server
                    .on("connection", (socket) => {
                        theSocket = socket;
                        socket.on("join-team", () => {
                            socket.emit("team-joined", {
                                "Alex": null,
                                "Joey": null,
                                "Josh": null,
                            }, () => {
                                resolveJoinTeam();
                            });
                        });

                        socket.on("point-story", () => {
                            socket.emit("story-pointed", {
                                "Alex": 1,
                                "Joey": null,
                                "Josh": 2,
                            }, () => {
                                resolvePointed();
                            });
                        })
                    })
            });
        });
    });

    afterEach(() => {
        server.close();
    });

    describe("joining the team", () => {
        let app: ReactWrapper;

        beforeEach(async () => {
            app = await mount(<App/>);

            app.find(".name")
                .simulate('change', {
                    target: {value: 'Alex'}
                });


            app.find(".save").simulate("submit");

            await act(async () => {
                await connection;

                app.update();
            });

        });

        it('should join a team', async () => {
            expect(app.find(Team).exists()).toBe(true);
            expect(app.find(".name").exists()).toBe(false);
        });

        it('should show the team', function () {
            expect(app.text()).toContain("Alex");
            expect(app.text()).toContain("Joey");
            expect(app.text()).toContain("Josh");
        });

        describe("pointing", () => {
            beforeEach(async () => {
                app.find(".button-one").simulate("click");

                await act(async () => {
                    await pointed;

                    app.update();
                });

            });

            it('should estimate and display only your estimate', async () => {
                expect(app.find(".team-votes").text()).toContain(1);
                expect(app.find(".team-votes").text()).not.toContain(2);
            });

            it('should display all estimates when complete', async () => {
                const estimationComplete = new Promise((resolve) => {
                    theSocket.emit("estimation-completed", {estimate: 2}, () => {
                        resolve();
                    });
                });

                await act(async () => {
                    await estimationComplete;

                    app.update();
                });

                expect(app.find(".team-votes").text()).toContain(2);
            });

            it('should display all estimates when complete and consensus not reached', async () => {
                const estimationComplete = new Promise((resolve) => {
                    theSocket.emit("consensus-not-reached", {
                        "Alex": 1,
                        "Joey": 1,
                        "Josh": 2,
                    }, () => {
                        resolve();
                    });
                });

                await act(async () => {
                    await estimationComplete;

                    app.update();
                });

                expect(app.find(".team-votes").text()).toContain(2);
                expect(app.find(".team-votes").text()).toContain(1);
                expect(app.text()).toContain("consensus not reached")
            });

            it('should point another story', async () => {
                const estimationComplete = new Promise((resolve) => {
                    theSocket.emit("consensus-not-reached", {
                        "Alex": 1,
                        "Joey": 1,
                        "Josh": 2,
                    }, () => {
                        resolve();
                    });
                });

                await act(async () => {
                    await estimationComplete;

                    app.update();
                });

                let pointsCleared;
                app.find(".point-again").simulate("click");

                await act(async () => {
                    pointsCleared = new Promise((resolve) => {
                        theSocket.emit("clear-points", {
                            "Alex": null,
                            "Joey": null,
                            "Josh": null,
                        }, () => {
                            resolve();
                        });
                    });

                    app.update();
                });

                expect(app.find(".team-votes").text()).not.toContain(2);
                expect(app.find(".team-votes").text()).not.toContain(1);
                expect(app.text()).not.toContain("consensus not reached")
            });
        });
    });
});