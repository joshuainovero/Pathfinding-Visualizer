import Node from './Node.jsx'

const Board = ({gridData, handleNodeClick}) => {

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