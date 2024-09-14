const Dropdown = ( {children, displayStyle} ) => {
    return (
        <div className="drop-down" style={{display: displayStyle}}>
            <ul>
                {children}
            </ul>
        </div>
    );
}

export default Dropdown;