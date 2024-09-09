import { useEffect, useState } from 'react';
import Node from './Node.jsx'
import NodeState from '../enums/nodeState.js';
import BFS from '../algorithms/bfs.js'
import Dijkstra from '../algorithms/dijkstra.js';
import AStar from '../algorithms/aStar.js'
import DFS from '../algorithms/dfs.js'
import Algorithms from '../enums/algorithms.js'

const AlgorithmFunctions = Object.freeze({
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
});

const Board = ({currentPfAlgorithm, visualizing, finishVisualizing}) => {

    const [gridData, setGridData] = useState([]);
    const [config, setConfig] = useState({
        Rows: 0,
        Cols: 0,
        Start: null,
        Target: null
    });

    useEffect(() => {
        fetch('/config.json')
            .then((response) => response.json())
            .then((data) => {
                
                setGridData(() => {
                    return Array.from({length: data.Rows}, (_, row) =>
                        Array.from({length: data.Cols}, (_, col) => ({
                            row: row,
                            col: col,
                            currentState: null,
                            neighbors: []
                        }))
                    )
                });   

                setConfig(data);
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });

    }, []);

    useEffect(() => {
        if (config.Start && config.Target) {
            modifyNodeData(config.Start[0], config.Start[1], {
                currentState: NodeState.Start
            });
        
            modifyNodeData(config.Target[0], config.Target[1], {
                currentState: NodeState.Target
            });
        }
    }, [config]);

    useEffect(() => {
        const handleVisualize = async () => {
            if (visualizing) {
                if (currentPfAlgorithm) {
                    console.log(currentPfAlgorithm);
                    clearVisualize();
                    updateNeighbors();
                    const visualizedData = AlgorithmFunctions[currentPfAlgorithm](getNodeFromState(NodeState.Start), getNodeFromState(NodeState.Target), gridData);
                    const visitedArray = visualizedData[0];
                    const pathArray = visualizedData[1];
                                        
                    await animateVisitedNodes(visitedArray, 5);
                    await animatePathNodes(pathArray, 20);
    
                } else {
                    alert("Choose an algorithm!");
                }
            }
        
            finishVisualizing();
        }

        handleVisualize();
    }, [visualizing]);

    const animateVisitedNodes = async (visitedArray, delay) => {
        for (let i = 0; i < visitedArray.length; i++) {
            const element = visitedArray[i];

            modifyNodeData(element.row, element.col, {
                currentState: NodeState.Visited
            });

            await new Promise(resolve => setTimeout(resolve, delay)); 
        }
    }

    const animatePathNodes = async (pathArray, delay) => {
        for (let i = pathArray.length - 1; i > 0; i--) {
            const element = pathArray[i];

            modifyNodeData(element.row, element.col, {
                currentState: NodeState.Path
            });

            await new Promise(resolve => setTimeout(resolve, delay)); 
        }
    }

    const modifyNodeData = (row, col, data) => {
        setGridData(prevGridData => {
            const newGridData = prevGridData.map(row => row.map(node => ({...node})));
            newGridData[row][col] = {...newGridData[row][col], ...data};
            return newGridData;
        });
    }

    const handleNodeClick = (row, col) => {
        const clickedNodeData = gridData[row][col];
    
        const startNodeData = getNodeFromState(NodeState.Start);
        if (startNodeData == null) {
            if (clickedNodeData.currentState == NodeState.Target) {
                return;
            }
            
            modifyNodeData(row, col, {
                currentState: NodeState.Start
            });
            return;
        }

        const targetNodeData = getNodeFromState(NodeState.Target);
        if (targetNodeData == null) {
            if (clickedNodeData.currentState == NodeState.Start) {
                return;
            }

            modifyNodeData(row, col, {
                currentState: NodeState.Target
            });
            return;
        }

        if (clickedNodeData.currentState == NodeState.Start || clickedNodeData.currentState == NodeState.Target) {
            modifyNodeData(row, col, {
                currentState: null
            });
            return;
        }

        modifyNodeData(row, col, {
            currentState: NodeState.Obstruction
        });
    }

    const updateNeighbors = () => {
        for (let row = 0; row < config.Rows; row++){
            for (let col = 0; col < config.Cols; col++){

                const nodeData = gridData[row][col];

                nodeData.neighbors = [];

                if (row < config.Rows - 1 && gridData[row + 1][col].currentState != NodeState.Obstruction) {
                    nodeData.neighbors.push(gridData[row + 1][col]);
                }
        
                if (row > 0 && gridData[row - 1][col].currentState != NodeState.Obstruction) {
                    nodeData.neighbors.push(gridData[row - 1][col]);
                }
        
                if (col < config.Cols - 1 && gridData[row][col + 1].currentState != NodeState.Obstruction) {
                    nodeData.neighbors.push(gridData[row][col + 1]);
                }
        
                if (col > 0 && gridData[row][col - 1].currentState != NodeState.Obstruction) {
                    nodeData.neighbors.push(gridData[row][col - 1]);
                }

            }
        }
    }

    const getNodeFromState = (nodeState) => {
        for (let row = 0; row < config.Rows; row++){
            for (let col = 0; col < config.Cols; col++){
                if (gridData[row][col].currentState == nodeState){
                    return gridData[row][col];
                }
            }
        }
    }

    const clearVisualize = () => {
        for (let row = 0; row < config.Rows; row++){
            for (let col = 0; col < config.Cols; col++){
                if (gridData[row][col].currentState == NodeState.Visited || gridData[row][col].currentState == NodeState.Path) {
                    modifyNodeData(row, col, {
                        currentState: null
                    })
                }
            }
        }
    }

    return (
        <div className="grid">
            {gridData.map((row, i) =>
                row.map((nodeData, k) => (
                    <Node
                        key={`${i}-${k}`}
                        row={i}
                        col={k}
                        currentState={nodeData.currentState}
                        handleNodeClick={handleNodeClick}
                    />
                ))
            )}
        </div>
    )
}

export default Board