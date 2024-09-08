import CompareNode from "../utils/compareNode.js";
import PriorityQueue from "../utils/priorityQueue.js"
import PathRecon from "./pathRecon.js"

export default (startNode, targetNode, gridData) => {
    const priorityQueue = new PriorityQueue();
    const gScore = new Map();
    const previous = new Map();
    const visited = new Map();

    gridData.map((row, i) =>
        row.map((_, k) => {
            gScore.set(gridData[i][k], 999999999)
        })
    )

    gScore.set(startNode, 0);
    priorityQueue.enqueue(startNode, gScore.get(startNode));

    const visitedArray = [];

    while (!priorityQueue.isEmpty()) {
        const currentNode = priorityQueue.dequeue();
        const currentDist = gScore.get(currentNode);

        if (!CompareNode(currentNode, startNode) && !CompareNode(currentNode, targetNode)){
            visitedArray.push(currentNode);
        }

        if (CompareNode(currentNode, targetNode)) {
            break;
        }

        currentNode.neighbors.forEach(neighbor => {
            if (!visited.get(neighbor)) {
                const tentativeGScore = currentDist + 1;
                if (tentativeGScore + 1 < gScore.get(neighbor)) {
                    gScore.set(neighbor, tentativeGScore);
                    priorityQueue.enqueue(neighbor, tentativeGScore);
                    previous.set(neighbor, currentNode);
                }
            }
        });

        visited.set(currentNode, true);
    }

    const pathArray = PathRecon(targetNode, startNode, previous);
    
    return [visitedArray, pathArray];
}