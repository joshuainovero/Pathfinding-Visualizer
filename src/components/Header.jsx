import { useState } from 'react'
import Algorithms from '../enums/algorithms.js'
import MazeAlgorithms from '../enums/mazeAlgorithms.js';

const pfDisplayNames = {
    [Algorithms.DFS]: "Depth-First Search",
    [Algorithms.BFS]: "Breadth-First Search",
    [Algorithms.Dijkstra]: "Dijkstra's Algorithm",
    [Algorithms.AStar]: "A* Search"
}

const mazeDisplayNames = {
    [MazeAlgorithms.Recursive]: "Recursive Backtrack"
}

const Header = ({handleSetPfAlgorithm, handleSetMazeAlgorithm, handleVisualizeButton, handleClearButton, currentPfAlgorithm}) => {
   
    const [displayAlgo, setDisplayAlgo] = useState('none');
    const [displayMazeAlgo, setDisplayMaze] = useState('none');

    return (
        <div className="header-container">
            <div className="title-container">
                <p className="title">Pathfinding Visualizer</p>
            </div>

            <div className="options">
                <ul>
                    <li>
                        <button onClick={() => setDisplayAlgo(prev => prev === 'none'? 'block': 'none')} id="choose-algorithm">
                            {pfDisplayNames[currentPfAlgorithm] || "Choose Algorithm"} <i className="fa fa-caret-down"></i>
                            <div className="drop-down" style={{display: displayAlgo}}>
                                <ul>
                                    {Object.keys(Algorithms).map((algo) => 
                                    <li onClick={() => handleSetPfAlgorithm(algo)} key={algo}>
                                        {pfDisplayNames[algo]}
                                    </li>)}
                                </ul>
                            </div>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setDisplayMaze(prev => prev === 'none'? 'block': 'none')} id="choose-maze-algorithm"> 
                            Generate Maze <i className="fa fa-caret-down"></i>
                            <div className="drop-down" style={{display: displayMazeAlgo}}>
                                    <ul>
                                        {Object.keys(MazeAlgorithms).map((algo) => 
                                        <li onClick={() => handleSetMazeAlgorithm(algo)} key={algo}>
                                            {mazeDisplayNames[algo]}
                                        </li>)}
                                    </ul>
                            </div>
                        </button>
                    </li>
                    <li>
                        <button onClick={handleVisualizeButton} id="Play">Play</button>
                    </li>
                    <li>
                        <button onClick={handleClearButton} id="Clear">Clear Board</button>
                    </li>
                    <li>
                        <button>Speed <i className="fa fa-caret-down"></i></button>
                    </li>

                </ul>
            </div>
        </div>
    )
}

export default Header