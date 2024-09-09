import { useEffect, useState } from 'react';
import NodeState from './enums/nodeState.js'
import Header from './components/Header.jsx'
import Board from './components/Board.jsx'
import BFS from './algorithms/bfs.js'
import Dijkstra from './algorithms/dijkstra.js';
import AStar from './algorithms/aStar.js'
import DFS from './algorithms/dfs.js'
import Algorithms from './enums/algorithms.js'

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

const App = () => {
    const [pfAlgorithm, setPfAlgorithm] = useState(null);
    const [visualizing, setVisualize] = useState(false);
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
        const asyncHandleVisualize = async () => {
            if (visualizing) {
                if (pfAlgorithm) {
                    console.log(pfAlgorithm);
                    clearVisualize();
                    updateNeighbors();
                    const visualizedData = AlgorithmFunctions[pfAlgorithm](getNodeFromState(NodeState.Start), getNodeFromState(NodeState.Target), gridData);
                    const visitedArray = visualizedData[0];
                    const pathArray = visualizedData[1];
                                        
                    await animateVisitedNodes(visitedArray, 5);
                    await animatePathNodes(pathArray, 30);
    
                } else {
                    alert("Choose an algorithm!");
                }
            }
        
            handleVisualize(false);
        }

        asyncHandleVisualize();
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

    const handleVisualize = (state) => {
        if (visualizing && state) {
            console.log("Already!");
            return;
        }

        if (!state) {
            setVisualize(false);
            return;
        }

        setVisualize(true);
    } 

    const handleClearBoard = () => {
        if (visualizing){
            return;
        }

        clearBoard();
    }

    const modifyNodeData = (row, col, data) => {
        setGridData(prevGridData => {
            const newGridData = prevGridData.map(row => row.map(node => ({...node})));
            newGridData[row][col] = {...newGridData[row][col], ...data};
            return newGridData;
        });
    }

    const updateNeighbors = () => {
        const directions = [
            [1, 0], // down
            [-1, 0], // up
            [0, 1], // right
            [0, -1] // left
        ];

        const getNeighbor = (row, col, direction) => {
            const [dRow, dCol] = direction;
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (newRow >= 0 && newRow < config.Rows && newCol >= 0 && newCol < config.Cols) {
                return gridData[newRow][newCol].currentState != NodeState.Obstruction? gridData[newRow][newCol]: null;
            }
         }

         gridData.forEach((row, rowIndex) => {
            row.forEach((nodeData, colIndex) => {
                nodeData.neighbors = directions.map(dir => getNeighbor(rowIndex, colIndex, dir)).filter(Boolean);
            });
         });
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

    const clearBoard = () => {
        for (let row = 0; row < config.Rows; row++){
            for (let col = 0; col < config.Cols; col++){
                if (gridData[row][col].currentState == NodeState.Start || gridData[row][col].currentState == NodeState.Target) {
                    continue;
                }

                modifyNodeData(row, col, {
                    currentState: null
                })
            }
        }
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
    const getNodeFromState = (nodeState) => {
        for (let row = 0; row < config.Rows; row++){
            for (let col = 0; col < config.Cols; col++){
                if (gridData[row][col].currentState == nodeState){
                    return gridData[row][col];
                }
            }
        }
    }

    const executeMazeAlgo = (algo) => {
        console.log(algo);
    }

    return (
        <div className="wrapper">
            <Header 
            handleSetPfAlgorithm={(algo) => setPfAlgorithm(algo)} 
            handleSetMazeAlgorithm={(algo) => executeMazeAlgo(algo)}
            handleVisualizeButton={() => handleVisualize(true)}
            handleClearButton={handleClearBoard}
            currentPfAlgorithm={pfAlgorithm}
            />
            <Board 
            gridData={gridData}
            handleNodeClick={handleNodeClick}
            />
        </div>
    )
}

export default App