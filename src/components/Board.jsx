import { useEffect, useState } from 'react';
import Node from './Node.jsx'
import NodeState from '../enums/nodeState.js';
import BFS from '../algorithms/bfs.js'
import Dijkstra from '../algorithms/dijkstra.js';
import AStar from '../algorithms/aStar.js'
import DFS from '../algorithms/dfs.js'

const ROWS = 22;
const COLS = 50;

const Board = ({currentPfAlgorithm, visualizing, finishVisualizing}) => {

    const [gridData, setGridData] = useState(() => {
        return Array.from({length: ROWS}, (_, row) =>
            Array.from({length: COLS}, (_, col) => ({
                row: row,
                col: col,
                currentState: null,
                neighbors: []
            }))
        )
    })

    useEffect(() => {
        modifyNodeData(11, 9, {
            currentState: NodeState.Start
        });

        modifyNodeData(11, 41, {
            currentState: NodeState.Target
        });

    }, []);

    useEffect(() => {
        (async () => {
            if (visualizing) {
                if (currentPfAlgorithm) {
                    console.log(currentPfAlgorithm);
                    clearVisualize();
                    updateNeighbors();
                    const visualizedData = DFS(getNodeFromState(NodeState.Start), getNodeFromState(NodeState.Target), gridData);
                    const visitedArray = visualizedData[0];
                    const pathArray = visualizedData[1];
                                        
                    await animateVisitedNodes(visitedArray, 5);
                    await animatePathNodes(pathArray, 20);
    
                } else {
                    alert("Choose an algorithm!");
                }
            }
        
            finishVisualizing();
        })();
    }, [visualizing])

    const modifyNodeData = (row, col, data) => {
        const newGridData = Array.from({length: ROWS}, (_, v) =>
            Array.from({length: COLS}, (_, k) => gridData[v][k])
        )

        for (const key in data) {
            newGridData[row][col][key] = data[key];
        }

        setGridData(newGridData);
    }

    const handleNodeClick = (row, col) => {
        modifyNodeData(row, col, {
            currentState: NodeState.Obstruction
        });
    }

    const updateNeighbors = () => {
        for (let row = 0; row < ROWS; row++){
            for (let col = 0; col < COLS; col++){

                const nodeData = gridData[row][col];

                nodeData.neighbors = [];

                if (row < ROWS - 1 && gridData[row + 1][col].currentState != NodeState.Obstruction) {
                    nodeData.neighbors.push(gridData[row + 1][col]);
                }
        
                if (row > 0 && gridData[row - 1][col].currentState != NodeState.Obstruction) {
                    nodeData.neighbors.push(gridData[row - 1][col]);
                }
        
                if (col < COLS - 1 && gridData[row][col + 1].currentState != NodeState.Obstruction) {
                    nodeData.neighbors.push(gridData[row][col + 1]);
                }
        
                if (col > 0 && gridData[row][col - 1].currentState != NodeState.Obstruction) {
                    nodeData.neighbors.push(gridData[row][col - 1]);
                }

            }
        }
    }

    const getNodeFromState = (nodeState) => {
        for (let row = 0; row < ROWS; row++){
            for (let col = 0; col < COLS; col++){
                if (gridData[row][col].currentState == nodeState){
                    return gridData[row][col];
                }
            }
        }
    }

    const clearVisualize = () => {
        for (let row = 0; row < ROWS; row++){
            for (let col = 0; col < COLS; col++){
                if (gridData[row][col].currentState == NodeState.Visited || gridData[row][col].currentState == NodeState.Path) {
                    modifyNodeData(row, col, {
                        currentState: null
                    })
                }
            }
        }
    }

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