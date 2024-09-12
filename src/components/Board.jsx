import Node from './Node.jsx'
import { forwardRef } from 'react'

const Board = forwardRef( (props, ref) => {
    return (
        <div className="grid">
            {props.gridData.map((row, i) =>
                row.map((nodeData, k) => (
                    <Node
                        key={`${i}-${k}`}
                        row={i}
                        col={k}
                        currentState={nodeData.currentState}
                        handleNodeClick={props.handleNodeClick}
                        ref = {ref}
                    />
                ))
            )}
        </div>
    )
})

export default Board