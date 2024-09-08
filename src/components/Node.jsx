import React from 'react';
import NodeState from '../enums/nodeState.js'
import { useEffect } from 'react';

const stateClasses = Object.freeze({
    [NodeState.Start]: "start",
    [NodeState.Target]: "target",
    [NodeState.Obstruction]: "blocked",
    [NodeState.Visited]: "visited",
    [NodeState.Path]: "path"
});


const Node = React.memo(({ row, col, currentState, handleNodeClick }) => {
    return (
        <div
            className={`node ${stateClasses[currentState] || 'clear'}`}
            id={`${row}-${col}`}
            onClick={() => handleNodeClick(row, col)}
        ></div>
    );
});
export default Node