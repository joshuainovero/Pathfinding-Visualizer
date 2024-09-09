import { useState } from 'react'
import Algorithms from '../enums/algorithms.js'

const pfDisplayNames = Object.freeze({
    [Algorithms.DFS]: "Depth-First Search",
    [Algorithms.BFS]: "Breadth-First Search",
    [Algorithms.Dijkstra]: "Dijkstra's Algorithm",
    [Algorithms.AStar]: "A* Search"
});

const Header = ({handleSetPfAlgorithm, handleVisualizeButton, handleClearButton, currentPfAlgorithm}) => {
   
    const [displayAlgo, setDisplayAlgo] = useState('none');

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
                            <div id="algorithm-dropdown" className="drop-down" style={{display: displayAlgo}}>
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
                        <button>Generate Maze <i className="fa fa-caret-down"></i></button>
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