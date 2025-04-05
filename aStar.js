function aStar(player, goalX, goalY, playerColor) {
    const heuristicBoard = boardHeuristic(goalX, goalY, gameGrid, gridSize);
    const initialPositions = players.map(p => [p.x, p.y]);
  
    // Create a priority queue
    const openList = new MinHeap();
    openList.insert({
      positions: initialPositions,
      heuristic: calculatedHeuristic(heuristicBoard, player),
      gScore: 0,
      fScore: calculatedHeuristic(heuristicBoard, player)
    });
  
  
    // Track visited states more efficiently
    const visited = new Set([JSON.stringify(initialPositions)]);
  
    while (!openList.isEmpty()) {
      const current = openList.extractMin();
      const positions = current.positions;
      const currentGScore = current.gScore;
  
      // Set all players to their positions in this state
      setAllPlayersPositions(players, positions);
  
      // Check if we've reached the goal
      // if (players[2].x === 6 && players[2].y === 15 && selectedPlayer === "player3") {
      //   console.log("Solution found!");
      //   return positions; // Return the winning positions
      // }
  
      // Try moving each player
      for (let i = 0; i < positions.length; i++) {
        // console.log(`Trying player ${i + 1}`);
        // setAllPlayersPositions(players, positions);
  
        playerPosition = players[i];
        const [row, col] = positions[i];
        const playerName = `player${i + 1}`;
  
        // Remove player's wall status temporarily
        gameGrid[playerPosition.y][playerPosition.x].isWall = false;
        selectedPlayer = playerName;
  
        // Set current position
        playerPosition.x = row;
        playerPosition.y = col;
        gameGrid[playerPosition.y][playerPosition.x].isWall = true;
  
        // Try each direction
        for (const direction of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) {
          // Store original position to revert later
          const originalX = playerPosition.x;
          const originalY = playerPosition.y;
  
          gameGrid[playerPosition.y][playerPosition.x].isWall = false;
          selectedPlayer = `player${i + 1}`;
          // placePlayer(row, col, `player${i + 1}`);
          playerPosition.x = row;
          playerPosition.y = col;
          gameGrid[playerPosition.y][playerPosition.x].isWall = true;
  
          // Attempt to move
          attemptMove(row, col, direction);
  
          // Get new positions of all players after move
          const newPositions = players.map(p => [p.x, p.y]);
          const positionKey = JSON.stringify(newPositions);
  
          // If this is a new state
          if (!visited.has(positionKey)) {
            visited.add(positionKey);
  
            // Only recalculate heuristic if player3 moved
            const newHeuristic = selectedPlayer === playerColor
              ? calculatedHeuristic(heuristicBoard, player)
              : current.heuristic;
  
            const newGScore = currentGScore + 1;
            const newFScore = newGScore + newHeuristic;
  
            openList.insert({
              positions: newPositions,
              heuristic: newHeuristic,
              gScore: newGScore,
              fScore: newFScore
            });
          }
  
          if (
            playerPosition.x === goalX &&
            playerPosition.y === goalY &&
            selectedPlayer === playerColor
        ) {
            console.log("nyertem");
            console.log("nyertem");
            console.log("nyertem");
            console.log(selectedPlayer);
            console.log(positions);
            console.log(player3.x, player3.y);
            console.log("Heuristic:");
            console.log(calculatedHeuristic(heuristicBoard, player));
            console.log("Current GScore:");
            console.log(currentGScore);
            // placePlayer(positions[2][0], positions[2][1], 'player3');
            console.log(gameGrid);
  
            return;
        }
          
  
          // Reset to original position
          // gameGrid[playerPosition.y][playerPosition.x].isWall = false;
          // // placePlayer(row, col, `player${i + 1}`);
          // playerPosition.x = row;
          // playerPosition.y = col;
          // gameGrid[playerPosition.y][playerPosition.x].isWall = true;
        }
  
        // Reset the wall status
        gameGrid[playerPosition.y][playerPosition.x].isWall = false;
        playerPosition.x = row;
        playerPosition.y = col;
        gameGrid[playerPosition.y][playerPosition.x].isWall = true;
      }
    }
  
    console.log("No solution found");
    return null;
  }
  
  // MinHeap implementation for priority queue
  class MinHeap {
    constructor() {
      this.heap = [];
    }
  
    isEmpty() {
      return this.heap.length === 0;
    }
  
    insert(node) {
      this.heap.push(node);
      this.siftUp(this.heap.length - 1);
    }
  
    extractMin() {
      if (this.isEmpty()) return null;
  
      const min = this.heap[0];
      const last = this.heap.pop();
  
      if (!this.isEmpty()) {
        this.heap[0] = last;
        this.siftDown(0);
      }
  
      return min;
    }
  
    siftUp(index) {
      let parent = Math.floor((index - 1) / 2);
  
      if (index > 0 && this.heap[index].fScore < this.heap[parent].fScore) {
        [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
        this.siftUp(parent);
      }
    }
  
    siftDown(index) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      const length = this.heap.length;
  
      if (left < length && this.heap[left].fScore < this.heap[smallest].fScore) {
        smallest = left;
      }
  
      if (right < length && this.heap[right].fScore < this.heap[smallest].fScore) {
        smallest = right;
      }
  
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        this.siftDown(smallest);
      }
    }
  }