import BFS from '../algorithms/bfs.js'
import Dijkstra from '../algorithms/dijkstra.js';
import AStar from '../algorithms/aStar.js'
import DFS from '../algorithms/dfs.js'
import Algorithms from '../enums/algorithms.js'

const AlgorithmFunctions = {
    [Algorithms.BFS]: (start, target, data) => {
        return BFS(start, target, data);
    },

    [Algorithms.Dijkstra]: (start, target, data) => {
        return Dijkstra(start, target, data);
    },

    [Algorithms.AStar]: (start, target, data) => {
        return AStar(start, target, data);
    },

    [Algorithms.DFS]: (start, target, data) => {
        return DFS(start, target, data);
    }
};

export default AlgorithmFunctions