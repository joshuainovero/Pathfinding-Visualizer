import Queue from '../utils/queue.js'
import CompareNode from '../utils/compareNode.js'
import PathRecon from "./pathRecon.js"

export default (startNode, targetNode) => {
    const queue = new Queue();
    const visited = new Map();
    const previous = new Map();

    queue.enqueue(startNode);
    visited.set(startNode, true);

    const visitedArray = [];

    while (!queue.isEmpty()) {
        const currentNode = queue.dequeue();
        
        if (!CompareNode(currentNode, startNode) && !CompareNode(currentNode, targetNode)){
            visitedArray.push(currentNode);
        }

        if (CompareNode(currentNode, targetNode)) {
            break;
        }

        currentNode.neighbors.forEach(neighbor => {
            if (!visited.get(neighbor)){
                queue.enqueue(neighbor);
                visited.set(neighbor, true);
                previous.set(neighbor, currentNode);
            }
        });
    }

    const pathArray = PathRecon(targetNode, startNode, previous);

    return [visitedArray, pathArray];
}