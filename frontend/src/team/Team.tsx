import * as React from "react";
import {TeamWithVotes} from "../App";

const shouldDisplayAllVotes = (estimationComplete: boolean, vote: number, voteIsMine: boolean) => {
    if (estimationComplete) {
        return vote;
    } else if (voteIsMine) {
        return vote;
    } else {
        return null;
    }
};

export const Team = ({team, estimationComplete, name}: { team: TeamWithVotes, estimationComplete: boolean, name: string }) => {
    return <div className={"team-votes"}>
        <ul>
            {Object.keys(team).map(teamMembersName => {
                return <li key={teamMembersName}>
                    Name: {teamMembersName} Vote: {shouldDisplayAllVotes(estimationComplete, team[teamMembersName], name === teamMembersName)}
                </li>
            })}
        </ul>
    </div>
};