import NodeState from "../enums/nodeState";

const stateClasses = {
    [NodeState.Start]: "start",
    [NodeState.Target]: "target",
    [NodeState.Obstruction]: "blocked"
};

export default stateClasses