export default class PriorityQueue {
    // The constructor method is called when a new instance of Priority Queue is created.
    constructor(comparator) {
      // Initialize the heap array.
      this.heap = [];
  
      // Set the comparator method for comparing nodes in the heap.
      // If no comparator function is provided, it defaults to a comparison
      // function that sorts in ascending order (a min-heap).
      this.comparator = comparator || ((a, b) => a - b);
  
      // Map stores internal indexes for more efficient updatePriority
      this._map = new Map();
  
      // Counter for the next ID to assign
      this._nextId = 0;
    }
  
    // Return the number of items in the heap.
    size() {
      return this.heap.length;
    }
  
    // Check if the heap is empty.
    isEmpty() {
      return this.size() === 0;
    }
  
    // Get the top element in the heap without removing it.
    // For a min-heap, this will be the smallest element;
    // for a max-heap, it will be the largest.
    peek() {
      return this.heap[0] ? this.heap[0].value : null;
    }
  
    // This method adds a new element with its priority into the priority queue.
    enqueue(value, priority) {
      // Generate a unique identifier for the new element.
      const _id = this._generateId();
  
      // Create an entry object containing the value, priority, and the generated ID.
      const entry = { value, priority, _id };
  
      // Add the new entry to the end of the heap array.
      this.heap.push(entry);
  
      // Store the index of this new entry in the map using its ID for efficient lookups.
      // This is important for the updatePriority operation, allowing us to quickly find an element's index.
      this._map.set(_id, this.heap.length - 1);
  
      // Reorganize the heap to maintain the heap property after adding a new element.
      // This ensures that the heap structure is maintained (either min-heap or max-heap).
      this._heapifyUp();
  
      // Return the unique ID of the new entry. This ID can be used later for operations like updatePriority.
      return _id;
    }
  
    // This method removes and returns the element with the highest priority (at the root of the heap).
    dequeue() {
      // Check if the heap is empty. If it is, return null.
      if (this.isEmpty()) {
        return null;
      }
  
      // The item to be dequeued is always at the root of the heap (index 0).
      const dequeuedItem = this.heap[0];
  
      // Remove the dequeued item's entry from the map using its unique ID.
      // This keeps the map updated with only current heap elements.
      this._map.delete(dequeuedItem._id);
  
      // Find the index of the last element in the heap.
      const bottom = this.size() - 1;
  
      // Check if there are more elements left in the heap after dequeuing.
      if (bottom > 0) {
        // Replace the root of the heap with the last element.
        this.heap[0] = this.heap[bottom];
  
        // Update the position of the moved item in the map.
        this._map.set(this.heap[0]._id, 0);
  
        // Remove the last element (now moved to the root) from the heap.
        this.heap.pop();
  
        // Reorganize the heap to maintain the heap property after the root change.
        this._heapifyDown();
      } else {
        // If there is only one element in the heap, remove it and clear the map.
        this.heap.pop();
        this._map.clear();
      }
  
      // Return the value of the dequeued item.
      return dequeuedItem.value;
    }
  
    // This method updates the priority of an element in the priority queue.
    updatePriority(id, newPriority) {
      // Retrieve the index of the element in the heap using the unique ID from the map.
      const index = this._map.get(id);
  
      // If the element with the given ID is not found in the map, exit the function early.
      if (index === undefined) {
        return;
      }
  
      // Retrieve the old priority of the element for comparison.
      const oldPriority = this.heap[index].priority;
  
      // Update the priority of the element in the heap with the new priority.
      this.heap[index].priority = newPriority;
  
      // Decide whether to heapify up or down based on the new priority.
      // If the new priority is higher (smaller value for min-heap), heapify up.
      // If the new priority is lower (larger value for min-heap), heapify down.
      if (
        this.comparator({ priority: newPriority }, { priority: oldPriority }) < 0
      ) {
        this._heapifyUpFromIndex(index);
      } else {
        this._heapifyDownFromIndex(index);
      }
    }
  
    search(value, equalityFn) {
      // Find the item in the heap using the provided equality function
      const item = this.heap.find((item) => equalityFn(item.value, value));
      return item ? item : null;
    }
  
    toSortedArray() {
      const sortedList = [...this.heap];
      return sortedList.sort((a, b) => this.comparator(a.priority, b.priority));
    }
  
    // ********************* Helper methods below: *********************
  
    // Method to generate unique ID for internal lookup map
    _generateId() {
      return this._nextId++; // Increment the ID counter and return the new ID
    }
  
    // Method to get the index of a node's parent.
    _parentIndex(index) {
      /*
      About Math.floor:
      
      We take the floor value of the division to 
      make sure we get the nearest lower integer value. 
      This is important because array indexes
      are integer values and cannot have fractional parts.
      */
      return Math.floor((index - 1) / 2);
    }
  
    // Method to get the index of a node's left child.
    _leftChildIndex(index) {
      return 2 * index + 1;
    }
  
    // Method to get the value of a node's right child.
    _rightChildIndex(index) {
      return 2 * index + 2;
    }
  
    // Method to check if a node has left child.
    // It returns true if the left child index is within the valid range of heap indexes,
    // which indicates that a left child exists.
    _hasLeftChild(index) {
      return this._leftChildIndex(index) < this.size();
    }
  
    // Method to check if a node has right child.
    // It returns true if the right child index is within the valid range of heap indexes,
    // which indicates that a right child exists.
    _hasRightChild(index) {
      return this._rightChildIndex(index) < this.size();
    }
  
    // Method to swap the values of two nodes in the heap.
    _swap(i, j) {
      // Swap the elements in the heap array at indices i and j.
      // This is commonly needed during heapify operations to maintain the heap invariant.
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  
      // After swapping the elements in the heap array, their positions (indices) have changed.
      // We must update the map to reflect these new positions.
      // Set the map entry for the element that was originally at index i (now at index j)
      // to the new index (j). The _id property is used as the key in the map.
      this._map.set(this.heap[i]._id, i);
  
      // Similarly, set the map entry for the element that was originally at index j (now at index i)
      // to the new index (i). As before, the _id property is used as the key in the map.
      this._map.set(this.heap[j]._id, j);
    }
  
    // This method rearranges the heap after adding a new element.
    _heapifyUp() {
      // Start with the last element added to the heap
      let nodeIndex = this.size() - 1;
  
      // Loop until the node reaches the root or the heap property is maintained
      while (
        nodeIndex > 0 &&
        // Compare the current node with its parent
        this.comparator(
          this.heap[nodeIndex].priority,
          this.heap[this._parentIndex(nodeIndex)].priority
        ) < 0
      ) {
        // If the current node's priority is higher than its parent, swap them
        this._swap(nodeIndex, this._parentIndex(nodeIndex));
        // Move to the parent node and continue
        nodeIndex = this._parentIndex(nodeIndex);
      }
    }
  
    // This method rearranges the heap after removing the top element.
    _heapifyDown() {
      // Start with the root node
      let currNodeIndex = 0;
  
      // Loop as long as the current node has a left child
      while (this._hasLeftChild(currNodeIndex)) {
        // Assume the left child is the smaller child
        let smallerChildIndex = this._leftChildIndex(currNodeIndex);
  
        // Check if the right child exists and is smaller than the left child
        if (
          this._hasRightChild(currNodeIndex) &&
          this.comparator(
            this.heap[this._rightChildIndex(currNodeIndex)].priority,
            this.heap[smallerChildIndex].priority
          ) < 0
        ) {
          // If so, the right child is the smaller child
          smallerChildIndex = this._rightChildIndex(currNodeIndex);
        }
  
        // If the current node is smaller than its smallest child, the heap is correct
        if (
          this.comparator(
            this.heap[currNodeIndex].priority,
            this.heap[smallerChildIndex].priority
          ) <= 0
        ) {
          break;
        }
  
        // Otherwise, swap the current node with its smallest child
        this._swap(currNodeIndex, smallerChildIndex);
        // Move to the smaller child and continue
        currNodeIndex = smallerChildIndex;
      }
    }
  
    // This method rearranges the heap upwards from a given index.
    _heapifyUpFromIndex(index) {
      // Start from the given index
      let currentIndex = index;
  
      // Continue as long as the current index is not the root
      while (currentIndex > 0) {
        // Find the parent index of the current index
        let parentIndex = this._parentIndex(currentIndex);
  
        // Compare the current node with its parent
        if (
          this.comparator(this.heap[currentIndex], this.heap[parentIndex]) < 0
        ) {
          // If current node is smaller than the parent, swap them
          this._swap(currentIndex, parentIndex);
          // Move to the parent node and continue
          currentIndex = parentIndex;
        } else {
          // If the current node is not smaller than the parent, stop the process
          break;
        }
      }
    }
  
    // This method rearranges the heap downwards from a given index.
    _heapifyDownFromIndex(index) {
      // Start from the given index
      let currentIndex = index;
  
      // Continue as long as the current node has a left child
      while (this._hasLeftChild(currentIndex)) {
        // Assume the left child is the smaller child
        let smallerChildIndex = this._leftChildIndex(currentIndex);
  
        // Check if the right child exists and is smaller than the left child
        if (
          this._hasRightChild(currentIndex) &&
          this.comparator(
            this.heap[this._rightChildIndex(currentIndex)],
            this.heap[smallerChildIndex]
          ) < 0
        ) {
          // If so, the right child is the smaller child
          smallerChildIndex = this._rightChildIndex(currentIndex);
        }
  
        // If the current node is smaller or equal to its smallest child, the heap is correct
        if (
          this.comparator(
            this.heap[currentIndex],
            this.heap[smallerChildIndex]
          ) <= 0
        ) {
          break;
        }
  
        // Otherwise, swap the current node with its smallest child
        this._swap(currentIndex, smallerChildIndex);
        // Move to the smaller child and continue
        currentIndex = smallerChildIndex;
      }
    }
}