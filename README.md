# Pathfinding Visualizer

Visualize common pathfinding algorithms through dynamic animations using this application!

## What is Pathfinding?

In computer science, pathfinding refers to the process of finding the shortest or most efficient route between two points. Graphs are essential to pathfinding algorithms, serving as the environment through which we navigate. The type of algorithm used determines how the graph is traversed and how the shortest path is found.

## How to Use

### Setting the Starting and Target Nodes

To reposition the starting node and target node from their default locations, simply right-click and drag them to your desired position on the board.

### Adding and Deleting Walls

White tiles on the board are available for placing wall nodes. To delete a wall, right-click on any obstructed tile. If you’ve placed too many obstacles or created a maze, you can clear all walls with a button press.

### Choosing an Algorithm

The A* algorithm is selected by default. You can choose a different algorithm by clicking one of the boxes in the left panel.

### Visualize!

Once you’ve set your configurations, press the "Visualize" button at the top-center of the screen to see the algorithm in action.

## Available Algorithms

- **A\* Search**: The A* algorithm extends the principles of Dijkstra’s shortest path algorithm by introducing a heuristic to prioritize which nodes to evaluate next. This makes it more efficient in finding the shortest path between two points.
  
- **Dijkstra's Algorithm**: Dijkstra’s algorithm finds the shortest path from a starting node to a target node in a weighted graph. It works by constructing a tree of shortest paths from the source node to all other points.

- **Breadth-First Search**: BFS is a fundamental graph traversal algorithm that explores all neighboring nodes at the present depth before moving on to nodes at the next depth level. It only works on unweighted graphs.

- **Depth-First Search**: DFS explores as far as possible along a path before backtracking. While it is fast for some cases, it is not optimal for finding the shortest path and works only on unweighted graphs.

## Maze Algorithms

- **Recursive Backtracker**: A randomized version of the depth-first search algorithm, generating a perfect maze with no inaccessible areas or loops.
