import BoardConfig from '../configs/board.js'

const shuffleArray = (array) => {
    const copyArray = [...array]
    let currentIndex = copyArray.length;
  
    while (currentIndex != 0) {
  
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [copyArray[currentIndex], copyArray[randomIndex]] = [
        copyArray[randomIndex], copyArray[currentIndex]];
    }

    return copyArray;
}

const mazeRecursion = (current, gridData, mazeMap) => {

    mazeMap.set(current, true);

    const randomizedNeighbors = shuffleArray(current.neighbors);

    randomizedNeighbors.forEach(neighbor => {
        let nextNeighbor = null;
        const row = neighbor.row;
        const col = neighbor.col;

        if (row > current.row && row < BoardConfig.rows - 1) {
            if (!mazeMap.get(gridData[row + 1][col])) {
                nextNeighbor = gridData[row + 1][col];
            }
        } 
        else if (row < current.row && row > 0) {
            if (!mazeMap.get(gridData[row - 1][col])) {
                nextNeighbor = gridData[row - 1][col];
            }
        }
        else if (col > current.col && col < BoardConfig.cols - 1) {
            if (!mazeMap.get(gridData[row][col + 1])) {
                nextNeighbor = gridData[row][col + 1];
            }
        }
        else if (col < current.col && col > 0) {
            if (!mazeMap.get(gridData[row][col - 1])) {
                nextNeighbor = gridData[row][col - 1];
            }
        }

        if (nextNeighbor != null) {
            mazeMap.set(neighbor, true);
            mazeRecursion(nextNeighbor, gridData, mazeMap);
        }
    });
}


export default (gridData) => {
    const current = gridData[0][0];
    const mazeMap = new Map();
    mazeRecursion(current, gridData, mazeMap);

    return mazeMap;    
}