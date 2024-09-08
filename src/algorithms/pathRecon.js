export default (current, startNode, previous) => {
    
    const nodesToAnimate = [];

    while (current != startNode) {
        nodesToAnimate.push(current);
        current = previous.get(current);
    }

    return nodesToAnimate;
}