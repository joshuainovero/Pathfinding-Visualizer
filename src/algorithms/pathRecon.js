export default (current, startNode, previous) => {
    
    const nodesToAnimate = [];

    if (!previous.get(current))
        return;

    while (current != startNode) {
        nodesToAnimate.push(current);
        current = previous.get(current);
    }

    return nodesToAnimate;
}