import Node from './Node.jsx'
import { forwardRef } from 'react'

const Board = forwardRef( (props, ref) => {
    return (
        <div onMouseLeave = {props.handleMouseUp} className="grid">
            {props.gridData.map((row, i) =>
                row.map((nodeData, k) => (
                    <Node
                        key={`${i}-${k}`}
                        row={i}
                        col={k}
                        currentState={nodeData.currentState}
                        handleNodeClick={props.handleNodeClick}
                        ref = {ref}
                        handleMouseDown = {props.handleMouseDown}
                        handleMouseEnter = {props.handleMouseEnter}
                        handleMouseUp = {props.handleMouseUp}
                    />
                ))
            )}
        </div>
    )
})

export default Board