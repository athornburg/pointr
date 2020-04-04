import * as React from "react";

export const Signup = ({joinTeam, saveName, name}: {joinTeam: (name: string) => void, saveName: (name: string) => void, name: string}) => {
    return  <form className="save" onSubmit={(e) => {
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
};
