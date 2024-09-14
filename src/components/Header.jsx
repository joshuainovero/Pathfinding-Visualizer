import { useEffect, useState } from 'react'
import Dropdown from './Dropdown.jsx';
import Algorithms from '../enums/algorithms.js'
import MazeAlgorithms from '../enums/mazeAlgorithms.js';
import AlgoSpeed from '../enums/algoSpeed.js'

const pfDisplayNames = {
    [Algorithms.DFS]: "Depth-First Search",
    [Algorithms.BFS]: "Breadth-First Search",
    [Algorithms.Dijkstra]: "Dijkstra's Algorithm",
    [Algorithms.AStar]: "A* Search"
}

const mazeDisplayNames = {
    [MazeAlgorithms.Recursive]: "Recursive Backtrack"
}

const Header = ({handleSetPfAlgorithm, handleSetMazeAlgorithm, handleSetSpeed, handleVisualizeButton, handleClearButton, currentPfAlgorithm, currentSpeed}) => {
   
    const templDropdowns = {
        pathfinding: 'none',
        maze: 'none',
        speed: 'none'
    }

    const [displayedDropdowns, setDisplayedDropdowns] = useState({...templDropdowns});

    const handleDropdown = (dropdownName) => {
        const dropDown = {...templDropdowns};
        if (displayedDropdowns[dropdownName] == 'none')
            dropDown[dropdownName] = 'block';
       
        setDisplayedDropdowns(dropDown);
    }

    useEffect(() => {
        setDisplayedDropdowns({...templDropdowns});

    }, [currentPfAlgorithm, currentSpeed]);

    return (
        <div className="header-container">
            <div className="title-container">
                <p className="title">Pathfinding Visualizer</p>
            </div>

            <div className="options">
                <ul>
                    <li>
                        <button onClick={() => handleDropdown('pathfinding')}>
                            {pfDisplayNames[currentPfAlgorithm] || "Choose Algorithm"} <i className="fa fa-caret-down"></i>
                            <Dropdown displayStyle={displayedDropdowns.pathfinding}>
                                {Object.keys(Algorithms).map((algo) => 
                                <li onClick={() => handleSetPfAlgorithm(algo)} key={algo}>
                                    {pfDisplayNames[algo]}
                                </li>)}   
                            </Dropdown>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleDropdown('maze')}> 
                            Generate Maze <i className="fa fa-caret-down"></i>
                                <Dropdown displayStyle={displayedDropdowns.maze}>     
                                    {Object.keys(MazeAlgorithms).map((algo) => 
                                    <li onClick={() => handleSetMazeAlgorithm(algo)} key={algo}>
                                        {mazeDisplayNames[algo]}
                                    </li>)}
                                </Dropdown>
                        </button>
                    </li>
                    <li>
                        <button onClick={handleVisualizeButton} id="Play">Play</button>
                    </li>
                    <li>
                        <button onClick={handleClearButton} id="Clear">Clear Board</button>
                    </li>
                    <li>
                        <button onClick={() => handleDropdown('speed')} id="choose-speed">
                            {currentSpeed && `Speed: ${currentSpeed}` || "Speed"} <i className="fa fa-caret-down"></i>
                                <Dropdown displayStyle={displayedDropdowns.speed}>
                                    {Object.keys(AlgoSpeed).map((algo) => 
                                    <li onClick={() => handleSetSpeed(algo)} key={algo}>
                                        {algo}
                                    </li>)}
                                </Dropdown>
                        </button>
                    </li>

                </ul>
            </div>
        </div>
    );
};

export default Header;