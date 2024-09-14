import { useEffect, useState, useRef } from 'react';
import MainTemplate from './components/MainTemplate.jsx'
import Header from './components/Header.jsx'
import Board from './components/Board.jsx'
import NodeState from './enums/nodeState.js'
import AlgoSpeed from './enums/algoSpeed.js';
import AlgoSpeedValue from './utils/algoSpeedValue.js';
import AlgorithmFunctions from './utils/algorithmFunctions.js';
import BoardConfig from './configs/board.js'
import recursiveBacktrack from './algorithms/recursiveBacktrack.js';

const App = () => {
    const [pfAlgorithm, setPfAlgorithm] = useState();
    const [mazeAlgorithm, setMazeAlgorithm] = useState();
    const [algoSpeed, setAlgoSpeed] = useState(BoardConfig.initialSpeed);
    const [visualizing, setVisualize] = useState(false);
    const [gridData, setGridData] = useState([]);
    const [isMouseDown, setIsMouseDown] = useState(false);

    const refAlgoSpeed = useRef(BoardConfig.initialSpeed);

    const gridRef = useRef();
    gridRef.current = Array.from({length: BoardConfig.rows}, (_, row) =>
        Array.from({length: BoardConfig.cols}, (_, col) => useRef())
    );

    useEffect(() => {
        setGridData(() => {
            return Array.from({length: BoardConfig.rows}, (_, row) =>
                Array.from({length: BoardConfig.cols}, (_, col) => ({
                    row: row,
                    col: col,
                    currentState: (row == BoardConfig.start[0] && col == BoardConfig.start[1]) ? 
                        NodeState.Start : (
                        row == BoardConfig.target[0] && col == BoardConfig.target[1]) ? 
                        NodeState.Target : null,
                    neighbors: []
                })) 
            )
        });
    }, []);

    useEffect(() => {
        const asyncHandleVisualize = async () => {
            if (!visualizing) {
                return;
            }

            if (pfAlgorithm) {
                clearVisualize();
                updateNeighbors();

                const startNode = getNodeFromState(NodeState.Start)
                const targetNode = getNodeFromState(NodeState.Target)

                const visualizedData = AlgorithmFunctions[pfAlgorithm](startNode, targetNode, gridData);
                const visitedArray = visualizedData[0];
                const pathArray = visualizedData[1];
                
                visitedArray.unshift(startNode);
                visitedArray.push(targetNode);

                pathArray.push(startNode);
                pathArray.unshift(targetNode);
                                    
                await animateVisitedNodes(visitedArray);
                await animatePathNodes(pathArray, 30);

            } else {
                alert("Choose an algorithm!");
            }


            handleVisualize(false);
        }

        asyncHandleVisualize();
    }, [visualizing]);

    const executeMazeAlgo = () => {
        updateNeighbors();

        const mazeMap = recursiveBacktrack(gridData);

        Array.from({length: BoardConfig.rows}, (_, row) =>
            Array.from({length: BoardConfig.cols}, (_, col) => {

                if (mazeMap.get(gridData[row][col])) {
                    modifyNodeData(row, col, {
                        currentState: null
                    });
                }
                else {
                    modifyNodeData(row, col, {
                        currentState: NodeState.Obstruction
                    });
                }
        }));

        modifyNodeData(0, 0, {
            currentState: NodeState.Start
        });

        modifyNodeData(26, 64, {
            currentState: NodeState.Target
        });
    }

    const modifyNodeData = (row, col, data) => {
        setGridData(prevGridData => {
            prevGridData[row][col] = { ...prevGridData[row][col], ...data };
            return [...prevGridData]; 
        });
    };

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

            if (newRow >= 0 && newRow < BoardConfig.rows && newCol >= 0 && newCol < BoardConfig.cols) {
                return gridData[newRow][newCol].currentState != NodeState.Obstruction? gridData[newRow][newCol]: null;
            }
         }

         gridData.forEach((row, rowIndex) => {
            row.forEach((nodeData, colIndex) => {
                nodeData.neighbors = directions.map(dir => getNeighbor(rowIndex, colIndex, dir)).filter(Boolean);
            });
         });
    };


    const animateVisitedNodes = async (visitedArray, delay) => {
        for (let i = 0; i < visitedArray.length; i++) {
            const dataNode = visitedArray[i];

            const element = gridRef.current[dataNode.row][dataNode.col].current;

            element.classList.add("visited");

            await new Promise(resolve => setTimeout(resolve, AlgoSpeedValue[refAlgoSpeed.current])); 
        }
    };

    const animatePathNodes = async (pathArray, delay) => {
        for (let i = pathArray.length - 1; i > 0; i--) {
      
            const dataNode = pathArray[i];

            const element = gridRef.current[dataNode.row][dataNode.col].current;

            element.classList.add("path");

            await new Promise(resolve => setTimeout(resolve, delay)); 
        }
    };

    const handleVisualize = (state) => {
        if (visualizing && state) {
            return;
        }

        if (!state) {
            setVisualize(false);
            return;
        }

        setVisualize(true);
    };

    const handleClearBoard = () => {
        if (visualizing){
            return;
        }

        clearBoard();
    };

    const clearVisualize = () => {
        Array.from({length: BoardConfig.rows}, (_, row) =>
            Array.from({length: BoardConfig.cols}, (_, col) => {
                const nodeRef = gridRef.current[row][col].current
                nodeRef.classList.remove("visited");
                nodeRef.classList.remove("path"); 
        }));
    }

    const clearBoard = () => {
        Array.from({length: BoardConfig.rows}, (_, row) =>
            Array.from({length: BoardConfig.cols}, (_, col) => {
                const nodeRef = gridRef.current[row][col].current
                nodeRef.classList.remove("visited");
                nodeRef.classList.remove("path");

                if (gridData[row][col].currentState == NodeState.Start || gridData[row][col].currentState == NodeState.Target) {
                    return;
                }

                modifyNodeData(row, col, {
                    currentState: null
                })
        }));
    };

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

    };

    const getNodeFromState = (nodeState) => {
        for (let row = 0; row < BoardConfig.rows; row++){
            for (let col = 0; col < BoardConfig.cols; col++){
                if (gridData[row][col].currentState == nodeState){
                    return gridData[row][col];
                }
            }
        }
    };

    const handleAlgoSpeed = (speed) => {
        setAlgoSpeed(speed);
        refAlgoSpeed.current = speed;
    };

    const handleMouseDown = (row, col) => {
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
            currentState: gridData[row][col].currentState == NodeState.Obstruction ? null : NodeState.Obstruction
        });

        setIsMouseDown(true);
    };

    const handleMouseEnter = (row, col) => {
        if (!isMouseDown) {
            return;
        }

        modifyNodeData(row, col, {
            currentState: gridData[row][col].currentState == NodeState.Obstruction ? null : NodeState.Obstruction
        });
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    return (
        <MainTemplate>
            <Header 
                handleSetPfAlgorithm={(algo) => setPfAlgorithm(algo)} 
                handleSetMazeAlgorithm={(algo) => executeMazeAlgo(algo)}
                handleSetSpeed={handleAlgoSpeed}
                handleVisualizeButton={() => handleVisualize(true)}
                handleClearButton={handleClearBoard}
                currentPfAlgorithm={pfAlgorithm}
                currentSpeed={algoSpeed}
            />
            <Board 
                gridData={gridData}
                handleNodeClick={handleNodeClick}
                handleMouseDown = {handleMouseDown}
                handleMouseEnter = {handleMouseEnter}
                handleMouseUp = {handleMouseUp}
                ref = {gridRef}
            />   
        </MainTemplate>
    );
};

export default App;