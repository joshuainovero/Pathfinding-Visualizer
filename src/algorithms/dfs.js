import CompareNode from "../utils/compareNode.js";
import PathRecon from "./pathRecon.js"

export default (startNode, targetNode) => {

    let foundTarget = false;

    const visitedArray = [];

    function dfsHelper (visited, currentNode, previous) {
    
        if (!CompareNode(currentNode, startNode) && !CompareNode(currentNode, targetNode)){
            visitedArray.push(currentNode);
        }
    
        if (CompareNode(currentNode, targetNode)) {
            foundTarget = true;
            return;
        }
    
        visited.set(currentNode, true);
    
        for (let neighbor of currentNode.neighbors) {
            if (!visited.get(neighbor)) {
                previous.set(neighbor, currentNode);
    
                if (foundTarget) {
                    return;
                }
    
                dfsHelper(visited, neighbor, previous);
            }
        }
    }
    
    const visited = new Map();
    const previous = new Map();

    dfsHelper(visited, startNode, previous);

    const pathArray = PathRecon(targetNode, startNode, previous);
    foundTarget = false;

    return [visitedArray, pathArray];
}