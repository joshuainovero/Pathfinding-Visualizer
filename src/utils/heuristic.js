const heuristic = {
    manhattanDistance: (arr1, arr2) => {
        const xOne = arr1[0];
        const xTwo = arr2[0];

        const yOne = arr1[1];
        const yTwo = arr2[1];

        const deltaX = Math.abs(xOne - xTwo);
        const deltaY = Math.abs(yOne - yTwo);

        return 1.005 * (deltaX + deltaY);
    }
}

export default heuristic;