import { forwardRef, memo } from 'react';
import StateClasses from '../utils/stateClasses';

const Node = memo( forwardRef( (props, ref ) => {
    return (
        <div
            className='node'
            id={`${props.row}-${props.col}`}
            // onClick={() => props.handleNodeClick(props.row, props.col)}
            onMouseDown={() => props.handleMouseDown(props.row, props.col)}
            onMouseEnter={() => props.handleMouseEnter(props.row, props.col)}
            onMouseUp={() => props.handleMouseUp(props.row, props.col)}
        >
            <div 
                className={`nodeInner ${StateClasses[props.currentState] || 'clear'}`}
                ref = {ref.current[props.row][props.col]}
            >

            </div>

        </div>
    );
}));

export default Node