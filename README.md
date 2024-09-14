# Pathfinding Visualizer

Easily visualize popular pathfinding algorithms with this interactive tool!

## What is Pathfinding?

Pathfinding is a technique in computer science used to determine the most efficient route between two points, typically within a graph. A graph consists of nodes (points) and edges (connections between points), and different pathfinding algorithms are used to explore these connections in unique ways.

## How to Use

### Setting the Start and Target Nodes

To move the starting and target nodes, right-click on them and drag them to your desired location on the grid.

### Adding and Removing Walls

Click on any white tile to add a wall (obstacle) at that location. To remove a wall, simply right-click on it. If you need to clear multiple obstacles or reset the grid, use the "Clear" button.

### Selecting an Algorithm

By default, the A* algorithm is selected. To explore other algorithms, click on the drop down at the header to switch between available options.

### Start the Visualization

Once you've configured your grid and selected an algorithm, press the "Visualize" button at the top-center of the screen to start the animation and see the algorithm in action.

## Available Algorithms

- **A\* Search**: A* is a popular pathfinding algorithm that extends Dijkstra’s algorithm by adding a heuristic, helping the search process prioritize certain nodes to reach the goal faster.
  
- **Dijkstra’s Algorithm**: Dijkstra’s algorithm guarantees the shortest path in a weighted graph by exploring nodes in order of increasing distance from the starting node.

- **Breadth-First Search (BFS)**: BFS explores nodes layer by layer, starting from the source and visiting all neighboring nodes before moving outward. It is only applicable to unweighted graphs.

- **Depth-First Search (DFS)**: DFS explores as far down a branch as possible before backtracking. While useful in some cases, it is not ideal for finding the shortest path and works only for unweighted graphs.

## Maze Generation Algorithm

- **Recursive Backtracker**: This algorithm uses a randomized version of depth-first search to generate mazes. The result is a perfect maze with no loops or inaccessible areas.
