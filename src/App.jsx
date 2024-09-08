import { useState } from 'react'
import Header from './components/Header.jsx'
import Board from './components/Board.jsx'

const App = () => {
    const [pfAlgorithm, setPfAlgorithm] = useState(null);
    const [visualizing, setVisualize] = useState(false);

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

    return (
        <div className="wrapper">
            <Header 
            handleSetPfAlgorithm={(algo) => setPfAlgorithm(algo)} 
            currentPfAlgorithm={pfAlgorithm} 
            handleVisualize={handleVisualize}
            />
            <Board 
            currentPfAlgorithm={pfAlgorithm}
            visualizing={visualizing}
            finishVisualizing={()=>handleVisualize(false)}
            />
        </div>
    )
}

export default App