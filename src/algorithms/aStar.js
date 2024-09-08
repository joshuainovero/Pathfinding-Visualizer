import PriorityQueue from "../utils/priorityQueue.js"
import Heuristic from "../utils/heuristic.js"
import PathRecon from "./pathRecon.js"
import CompareNode from "../utils/compareNode.js"

export default (startNode, targetNode, gridData) => {
    const priorityQueue = new PriorityQueue();
    const gScore = new Map();
    const fScore = new Map();
    const previous = new Map();
    const visited = new Map();

    visited.set(startNode, true);

    gridData.map((row, i) =>
        row.map((_, k) => {
            gScore.set(gridData[i][k], 999999999);
            fScore.set(gridData[i][k], 999999999);
        })
    )

    visited.set(startNode, true);
    gScore.set(startNode, 0);
    fScore.set(startNode, Heuristic.manhattanDistance([startNode.row, startNode.col], [targetNode.row, targetNode.col]));
    priorityQueue.enqueue(startNode, fScore.get(startNode));

    const visitedArray = [];

    while (!priorityQueue.isEmpty()) {
        const currentNode = priorityQueue.dequeue();
        visited.set(currentNode, true);

        if (!CompareNode(currentNode, startNode) && !CompareNode(currentNode, targetNode)){
            visitedArray.push(currentNode);
        }

        if (CompareNode(currentNode, targetNode)) {
            break;
        }

        currentNode.neighbors.forEach(neighbor => {
            if (!visited.get(neighbor)) {
                const tempGScore = gScore.get(currentNode) + 1;

                if (tempGScore < gScore.get(neighbor)) {
                    previous.set(neighbor, currentNode);
                    gScore.set(neighbor, tempGScore);
                    fScore.set(neighbor, tempGScore + Heuristic.manhattanDistance([neighbor.row, neighbor.col], [targetNode.row, targetNode.col]));
                    priorityQueue.enqueue(neighbor, fScore.get(neighbor));
                }
            }
        });

    }
    
    const pathArray = PathRecon(targetNode, startNode, previous);
    
    return [visitedArray, pathArray];
}