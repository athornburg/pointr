import * as React from "react";


export const Estimator = ({point, finalEstimate, pointAgain}: { point: (point: number) => void, finalEstimate: number | "consensus not reached" | undefined, pointAgain: () => void }) => {
    return <>
        <section>
            {finalEstimate}
            <button className={"point-again"} onClick={pointAgain}>Point Again</button>
        </section>
        <section>
            <button className={"button-zero"} onClick={() => point(0)}>0</button>
            <button className={"button-one"} onClick={() => point(1)}>1</button>
            <button className={"button-two"} onClick={() => point(2)}>2</button>
            <button className={"button-three"} onClick={() => point(3)}>3</button>
            `
        </section>
    </>
};