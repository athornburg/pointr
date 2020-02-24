import * as React from "react";
import {useEffect, useState} from "react";
import io from "socket.io-client";

export const App = () => {
   const [greeting, setGreeting] =  useState("");

    useEffect(() => {
        const socket = io("http://localhost:3000");
        socket.on("greeting", (message: any) => {
            setGreeting(message.greeting)
        })
    },[]);
    return <div>{greeting}</div>
};