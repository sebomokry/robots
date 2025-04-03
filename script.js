// Game state
const gridSize = 16;
let playerPosition; // Starting position
let player1 = { x: 5, y: 5 }; // Starting position
let player2 = { x: 10, y: 2 }; // Starting position
let player3 = { x: 7, y: 13 }; // Starting position
let player4 = { x: 8, y: 6 }; // Starting position
let player5 = { x: 9, y: 0 }; // Starting position
let players = [player1, player2, player3, player4, player5];

playerPosition = player1;

// Create a 2D array to represent the game grid
let gameGrid = Array(gridSize)
  .fill()
  .map(() =>
    Array(gridSize)
      .fill(null)
      .map(() => ({
        isWall: false,
        walls: {
          left: true,
          right: false,
          top: false,
          bottom: false,
        },
      }))
  );

// Game modes
const MODE_MOVE = "move";
const MODE_WALL = "wall";
let currentMode = MODE_MOVE;
let selectedWallDirection = "left";
let selectedPlayer = "player5";

const movement = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

// Initialize the game grid
function initializeGrid() {
  // Reset game grid
  gameGrid = Array(gridSize)
    .fill()
    .map(() =>
      Array(gridSize)
        .fill(null)
        .map(() => ({
          isWall: false,
          walls: {
            left: false,
            right: false,
            top: false,
            bottom: false,
          },
        }))
    );

  const container = document.getElementById("game-container");
  container.innerHTML = "";

  // Create grid cells
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      // Add walls to middle four cells
      if ((x === 7 || x === 8) && (y === 7 || y === 8)) {
        cell.classList.add("middle-wall");
        gameGrid[y][x].isWall = true;
      }

      if (board[y][x] === "R") {
        addWall(cell, "right");
        gameGrid[y][x].walls.right = true;
      } else if (board[y][x] === "L") {
        addWall(cell, "left");
        gameGrid[y][x].walls.left = true;
      } else if (board[y][x] === "T") {
        addWall(cell, "top");
        gameGrid[y][x].walls.top = true;
      } else if (board[y][x] === "B") {
        addWall(cell, "bottom");
        gameGrid[y][x].walls.bottom = true;
      }

      // Add click event to all cells
      cell.addEventListener("click", (e) => handleCellClick(x, y, e));
      container.appendChild(cell);
    }
  }

  // Place players at starting position
  players.forEach((player, index) => {
    playerPosition = player;
    placePlayer(player.x, player.y, `player${index + 1}`);
    gameGrid[player.y][player.x].isWall = true;
  });

  // Add keyboard controls
  document.addEventListener("keydown", handleKeyPress);
}

// Handle cell click based on current mode
function handleCellClick(x, y, event) {
  // console.log(gameGrid);
  if (currentMode === MODE_MOVE) {
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (cell.classList.length > 1) {
      selectedPlayer = cell.classList[1];
      let num = selectedPlayer.charAt(selectedPlayer.length - 1);
      playerPosition = players[num - 1];
      // console.log(num);
      // console.log(selectedPlayer);
    } else {
      movePlayer(x, y);
    }

    // movePlayer(x, y);
  } else if (currentMode === MODE_WALL) {
    toggleDirectionalWall(x, y, selectedWallDirection);
  }
}

function addWall(cell, direction) {
  if (!cell.querySelector(`.wall-${direction}`)) {
    // Prevent duplicates
    const wall = document.createElement("div");
    wall.classList.add(`wall-${direction}`);
    cell.appendChild(wall);
  }
}

function removeWall(cell, direction) {
  const wall = cell.querySelector(`.wall-${direction}`);
  if (wall) {
    wall.remove();
  }
}

// Toggle directional wall on a cell
function toggleDirectionalWall(x, y, direction) {
  // Prevent adding walls to middle walls or player position
  if (
    gameGrid[y][x].isWall ||
    (x === playerPosition.x && y === playerPosition.y)
  ) {
    return;
  }

  const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
  // const wallDirection = cell.querySelector(`.wall-${direction}`);
  // const className = `wall-${direction}`;

  // Toggle the wall
  if (gameGrid[y][x].walls[direction]) {
    gameGrid[y][x].walls[direction] = false;
    //  setWallDirection(direction);
    removeWall(cell, direction);
    // cell.classList.remove(className);
  } else {
    gameGrid[y][x].walls[direction] = true;
    addWall(cell, direction);
    // cell.classList.add(className);
  }
  // console.log(gameGrid[y][x].walls);
}

// Clear all directional walls
function clearAllWalls() {
  document
    .querySelectorAll(".wall-left, .wall-right, .wall-top, .wall-bottom")
    .forEach((cell) => {
      cell.classList.remove(
        "wall-left",
        "wall-right",
        "wall-top",
        "wall-bottom"
      );
    });

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!gameGrid[y][x].isWall) {
        gameGrid[y][x].walls = {
          left: false,
          right: false,
          top: false,
          bottom: false,
        };
      }
    }
  }
}

// Toggle game mode
function toggleGameMode() {
  if (currentMode === MODE_MOVE) {
    currentMode = MODE_WALL;
    document.getElementById("toggle-mode-btn").textContent =
      "Switch to Player Movement Mode";
    document.getElementById("wall-controls").style.display = "flex";
    document.getElementById("mode-indicator").textContent =
      "Mode: Wall Creation";
    document.getElementById("mode-indicator").style.backgroundColor = "#d4edda";
    document.getElementById("mode-indicator").style.borderColor = "#c3e6cb";
    document.getElementById("mode-indicator").style.color = "#155724";
  } else {
    currentMode = MODE_MOVE;
    document.getElementById("toggle-mode-btn").textContent =
      "Switch to Wall Creation Mode";
    document.getElementById("wall-controls").style.display = "none";
    document.getElementById("mode-indicator").textContent = "Mode: Move Player";
    document.getElementById("mode-indicator").style.backgroundColor = "#f8d7da";
    document.getElementById("mode-indicator").style.borderColor = "#f5c6cb";
    document.getElementById("mode-indicator").style.color = "#721c24";
  }
}

// Set selected wall direction
function setWallDirection(direction) {
  selectedWallDirection = direction;

  // Update button styling
  document.querySelectorAll(".wall-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });
  document.getElementById(`wall-${direction}-btn`).classList.add("selected");
}

// Place the player on the grid
function placePlayer(x, y, player) {
  // Clear previous player position
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => cell.classList.remove(player));

  // Add player to new position
  const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
  if (cell) {
    cell.classList.add(player);
    playerPosition.x = x;
    playerPosition.y = y;
    // console.log(playerPosition);
    // console.log(player);
  }
  //   gameGrid[x][y].isWall = true;
}

// Check if move is valid considering directional walls
function isValidMove(fromX, fromY, toX, toY, wallCheck = true) {
  // Check if destination is a full wall
  if (wallCheck) {
    if (gameGrid[toY][toX].isWall) {
      return false;
    }
  }

  // Check directional walls
  // Moving left
  if (toX < fromX) {
    if (gameGrid[fromY][fromX].walls.left || gameGrid[toY][toX].walls.right) {
      return false;
    }
  }
  // Moving right
  else if (toX > fromX) {
    if (gameGrid[fromY][fromX].walls.right || gameGrid[toY][toX].walls.left) {
      return false;
    }
  }
  // Moving up
  else if (toY < fromY) {
    if (gameGrid[fromY][fromX].walls.top || gameGrid[toY][toX].walls.bottom) {
      return false;
    }
  }
  // Moving down
  else if (toY > fromY) {
    if (gameGrid[fromY][fromX].walls.bottom || gameGrid[toY][toX].walls.top) {
      return false;
    }
  }

  return true;
}

function getRelativeDirection(curX, curY, x, y) {
  if (x > curX && y === curY) return "ArrowRight";
  if (x < curX && y === curY) return "ArrowLeft";
  if (y > curY && x === curX) return "ArrowDown";
  if (y < curY && x === curX) return "ArrowUp";
  return "Same Position";
}

// Move player to new position if valid and in move mode
function movePlayer(x, y) {
  if (currentMode !== MODE_MOVE) return;
  // console.log(playerPosition);

  let direction = getRelativeDirection(
    playerPosition.x,
    playerPosition.y,
    x,
    y
  );
  attemptMove(playerPosition.x, playerPosition.y, direction);

  //  // Check if the move is valid (not a wall and only one step in any direction)
  //  if (Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y) === 1 &&
  //      isValidMove(playerPosition.x, playerPosition.y, x, y)) {
  //      placePlayer(x, y);
  //  }
}

function attemptMove(newX, newY, direction) {
  // console.log("attemptMove");
  // console.log(newX, newY, direction);

  gameGrid[playerPosition.y][playerPosition.x].isWall = false;

  let x = playerPosition.x;
  let y = playerPosition.y;
  while (movement[direction]) {
    newX += movement[direction].x;
    newY += movement[direction].y;

    // Check if new position is valid and within grid bounds
    if (
      newX >= 0 &&
      newX < gridSize &&
      newY >= 0 &&
      newY < gridSize &&
      isValidMove(x, y, newX, newY)
    ) {
      // continue;
      x = newX;
      y = newY;
      // placePlayer(newX, newY, selectedPlayer);
    } else {
      // placePlayer(x, y, selectedPlayer);
      playerPosition.x = x;
      playerPosition.y = y;
      gameGrid[playerPosition.y][playerPosition.x].isWall = true;
      return;
      // break;
    }
  }
  // placePlayer(x, y, selectedPlayer);
  gameGrid[playerPosition.y][playerPosition.x].isWall = true;

  // placePlayer(newX, newY);
  // return playerPosition;
}

function bfsGrid(grid, startRow, startCol) {
  let queue = [[startRow, startCol]];
  let visited = new Set([`${startRow},${startCol}`]);

  while (queue.length > 0) {
    let [row, col] = queue.shift();
    // console.log(`Visiting: (${row}, ${col})`);
    gameGrid[playerPosition.y][playerPosition.x].isWall = false;
    placePlayer(row, col, selectedPlayer);
    gameGrid[playerPosition.y][playerPosition.x].isWall = true;

    for (let direction of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) {
      // console.log(`Direction: ${direction}`);
      gameGrid[playerPosition.y][playerPosition.x].isWall = false;
      placePlayer(row, col, selectedPlayer);
      gameGrid[playerPosition.y][playerPosition.x].isWall = true;

      // console.log(`Player Position: (${row}, ${col})`);
      //  ha ez visszater valami boolean ertekkel akkor jobb lehet
      attemptMove(row, col, direction);
      // console.log(`New Position: (${playerPosition.x}, ${playerPosition.y})`);

      if (
        // Check if walkable
        !visited.has(`${playerPosition.x},${playerPosition.y}`)
      ) {
        visited.add(`${playerPosition.x},${playerPosition.y}`);
        queue.push([playerPosition.x, playerPosition.y]);

        // console.log("itt vagyok");
      }
    }
    if (playerPosition.x === 15 && playerPosition.y === 15) {
      console.log("nyertem");
      console.log("nyertem");
      console.log("nyertem");
      break;
    }
  }
  // console.log("");
  // console.log(gameGrid);
}

function setAllPlayersPositions(players, positions) {
  for (let i = 0; i < players.length; i++) {
    gameGrid[players[i].y][players[i].x].isWall = false;
    players[i].x = positions[i][0];
    players[i].y = positions[i][1];
    gameGrid[players[i].y][players[i].x].isWall = true;
  }
}

function calculatedHeuristic(heuristicBoard, player){
  return heuristicBoard[player.y][player.x];
}

function aStar(player) {
  const heuristicBoard = boardHeuristic(6, 9, gameGrid, gridSize);
  const initialPositions = players.map((p) => [p.x, p.y]);

  let openList = [[initialPositions, calculatedHeuristic(heuristicBoard, player), 0]];
  let visited = new Set([
    `[${players.map((p) => `${p.x},${p.y}`).join(", ")}]`,
  ]);
  let count = 0;
  while (openList.length > 0) {
    count++;
    // console.log("oepn list:");
    // console.log(openList);
    // console.log(count);
    const currentNodes = openList.reduce((minNode, node) => 
      (node[1] + node[2]) < (minNode[1] + minNode[2]) ? node : minNode
    );
    console.log("currentNodes");
    console.log(currentNodes);
    const positions = currentNodes[0];
    // console.log("positions");
    // console.log(positions);
    const currentHeuristic = currentNodes[1];
    const currentRoute = currentNodes[2];
    openList = openList.filter((node) => node !== currentNodes);


    // console.log(`Visiting: (${row}, ${col})`);
    for (let i = 0; i < positions.length; i++) {
      setAllPlayersPositions(players, positions);
      let [row, col] = positions[i];
      playerPosition = players[i];
      // gameGrid[playerPosition.y][playerPosition.x].isWall = false;
      // placePlayer(row, col, `player${i + 1}`);
      // gameGrid[playerPosition.y][playerPosition.x].isWall = true;

      for (let direction of [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ]) {
        // console.log(`Direction: ${direction}`);
        gameGrid[playerPosition.y][playerPosition.x].isWall = false;
        selectedPlayer = `player${i + 1}`;
        // placePlayer(row, col, `player${i + 1}`);
        playerPosition.x = row;
        playerPosition.y = col;
        gameGrid[playerPosition.y][playerPosition.x].isWall = true;

        // console.log(`Player Position: (${row}, ${col})`);
        //  ha ez visszater valami boolean ertekkel akkor jobb lehet
        attemptMove(row, col, direction);
        // console.log(`New Position: (${playerPosition.x}, ${playerPosition.y})`);

        if (!visited.has(`[${players.map((p) => `${p.x},${p.y}`).join(", ")}]`)) {
          visited.add(`[${players.map((p) => `${p.x},${p.y}`).join(", ")}]`);
          const newPositions = players.map((p) => [p.x, p.y]);
          const newHeuristic = selectedPlayer == "player3" ? calculatedHeuristic(heuristicBoard, player) : currentHeuristic;
          const newRoute = currentRoute + 1;
          const newNode = [newPositions, newHeuristic, newRoute];
          // openList.push(newNode);
          // Add to open list if not already present
          const existingNodeIndex = openList.findIndex((node) => node[0] === newPositions);
          if (existingNodeIndex === -1) {
            openList.push(newNode);
          } else {
            // Update the route if shorter
            if (newRoute + newHeuristic < openList[existingNodeIndex][2] + openList[existingNodeIndex][1]) {
              openList[existingNodeIndex][1] = newHeuristic;
              openList[existingNodeIndex][2] = newNode;
              console.log("updated");
            }
          }
        }
        if (
          playerPosition.x === 6 &&
          playerPosition.y === 9 &&
          selectedPlayer === "player3"
        ) {
          console.log("nyertem");
          console.log("nyertem");
          console.log("nyertem");
          console.log(selectedPlayer);
          console.log(positions);
          console.log(player3.x, player3.y);
          // placePlayer(positions[2][0], positions[2][1], 'player3');
          console.log(gameGrid);

          return;
        }
        gameGrid[playerPosition.y][playerPosition.x].isWall = false;
        // placePlayer(row, col, `player${i + 1}`);
        playerPosition.x = row;
        playerPosition.y = col;
        gameGrid[playerPosition.y][playerPosition.x].isWall = true;
      }

      // console.log("itt");
      // console.log(visited);
    }
    // if (winX === 0 && winY === 2) {
    //   console.log("nyertem");
    //   console.log("nyertem");
    //   console.log("nyertem");
    //   return;
    // }
  }
}

class Node {
  constructor(x, y, g = 0, h = 0) {
    this.x = x; // x coordinate
    this.y = y; // y coordinate
    this.g = g; // Cost from start node to current node
    this.h = h; // Estimated cost from current node to goal
    this.f = g + h; // Total estimated cost (f = g + h)
    this.parent = null; // Parent node for path reconstruction
  }
}

function aStarSearch(grid, startX, startY) {

  const startNode = new Node(startX, startY);
  const goalNode = new Node(0, 0);

  const openList = [startNode];
  const closedSet = new Set();

  while (openList.length > 0) {
    const currentNode = openList.reduce((minNode, node) =>
      node.f < minNode.f ? node : minNode
    );

    if (currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
      return currentNode;
  }
  }
}

// function bfsGrid2(grid) {
//   // Create a copy of initial player positions to avoid modifying originals while working
//   const initialPositions = players.map(p => [p.x, p.y]);

//   // Use a more efficient queue implementation
//   let queue = [initialPositions];

//   // Create a more efficient visited set representation
//   const getPositionKey = positions => positions.map(([x, y]) => `${x},${y}`).join('|');
//   let visited = new Set([getPositionKey(initialPositions)]);

//   // Track the path to solution
//   const pathMap = new Map();

//   // Set reasonable iteration limit
//   const MAX_ITERATIONS = 10000;
//   let iterations = 0;

//   while (queue.length > 0 && iterations < MAX_ITERATIONS) {
//     iterations++;

//     const currentPositions = queue.shift();

//     // Check for win condition for any player
//     for (let i = 0; i < currentPositions.length; i++) {
//       const [x, y] = currentPositions[i];
//       if (x === 0 && y === 0) {
//         console.log("Solution found!");
//         console.log(`Player ${i+1} reached (0,0) in ${iterations} steps`);
//         // return "nyerteeel"
//         // Reconstruct and return path if needed
//         return reconstructPath(currentPositions, pathMap, getPositionKey);
//       }
//     }

//     // Try each player's possible moves
//     for (let playerIndex = 0; playerIndex < currentPositions.length; playerIndex++) {
//       const directions = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

//       for (const direction of directions) {
//         // Create a copy of positions to simulate this move
//         const newPositions = currentPositions.map(pos => [...pos]);

//         // Calculate new position based on direction without actually moving
//         const [currentX, currentY] = newPositions[playerIndex];
//         let newX = currentX;
//         let newY = currentY;

//         // Calculate new coordinates based on direction
//         switch (direction) {
//           case "ArrowUp": newY = Math.max(0, currentY - 1); break;
//           case "ArrowDown": newY = Math.min(grid.length - 1, currentY + 1); break;
//           case "ArrowLeft": newX = Math.max(0, currentX - 1); break;
//           case "ArrowRight": newX = Math.min(grid[0].length - 1, currentX + 1); break;
//         }

//         // Check if the move is valid (not into a wall)
//         if (!grid[newY][newX].isWall) {
//           newPositions[playerIndex] = [newX, newY];

//           // Check if this configuration has been visited
//           const posKey = getPositionKey(newPositions);
//           if (!visited.has(posKey)) {
//             visited.add(posKey);
//             queue.push(newPositions);
//             pathMap.set(posKey, {
//               previousPositions: currentPositions,
//               playerMoved: playerIndex,
//               direction: direction
//             });
//           }
//         }
//       }
//     }
//   }

//   // If we reach here, no solution was found
//   if (iterations >= MAX_ITERATIONS) {
//     console.log("Search terminated: reached maximum iterations");
//   } else {
//     console.log("No solution found");
//   }
//   return null;
// }

// Helper function to reconstruct the path from the solution
function reconstructPath(finalPositions, pathMap, getPositionKey) {
  const path = [];
  let currentPositions = finalPositions;

  while (pathMap.has(getPositionKey(currentPositions))) {
    const { previousPositions, playerMoved, direction } = pathMap.get(
      getPositionKey(currentPositions)
    );
    path.unshift({
      playerIndex: playerMoved,
      direction: direction,
    });
    currentPositions = previousPositions;
  }

  return path;
}

// Handle keyboard controls
function handleKeyPress(event) {
  if (event.key === "q") {
    console.log("q pressed");
    bfsGrid2(board);
    console.log(gameGrid);
    for (let i = 0; i < players.length; i++) {
      playerPosition = players[i];
      placePlayer(players[i].x, players[i].y, `player${i + 1}`);
    }
    // playerPosition = player5;
    // placePlayer(player5.x, player5.y, "player5");
    console.log("q executed");
    // console.log(path);
    return;
  }

  if (event.key === "s") {
    bfsGrid(board, playerPosition.x, playerPosition.y);
    return;
  }

  if (event.key === "h") {
    boardHeuristic(1, 1, gameGrid, gridSize);
    aStar(player3);
    console.log(gameGrid);
    for (let i = 0; i < players.length; i++) {
      playerPosition = players[i];
      placePlayer(players[i].x, players[i].y, `player${i + 1}`);
    }
    return;
  }
  if (currentMode !== MODE_MOVE) return;

  console.log("handleKeyPress");
  attemptMove(playerPosition.x, playerPosition.y, event.key);

  for (let i = 0; i < players.length; i++) {
    playerPosition = players[i];
    placePlayer(players[i].x, players[i].y, `player${i + 1}`);
  }
  event.preventDefault();
}

// Reset the game
function resetGame() {
  playerPosition = { x: 1, y: 1 };
  initializeGrid();

  // Reset to move mode
  if (currentMode !== MODE_MOVE) {
    toggleGameMode();
  }
}

// Initialize event listeners
function initEventListeners() {
  document.getElementById("reset-btn").addEventListener("click", resetGame);
  document
    .getElementById("toggle-mode-btn")
    .addEventListener("click", toggleGameMode);
  document
    .getElementById("clear-walls-btn")
    .addEventListener("click", clearAllWalls);

  // Wall direction buttons
  document
    .getElementById("wall-left-btn")
    .addEventListener("click", () => setWallDirection("left"));
  document
    .getElementById("wall-right-btn")
    .addEventListener("click", () => setWallDirection("right"));
  document
    .getElementById("wall-top-btn")
    .addEventListener("click", () => setWallDirection("top"));
  document
    .getElementById("wall-bottom-btn")
    .addEventListener("click", () => setWallDirection("bottom"));

  // Set initial selected wall direction
  //  setWallDirection('top');
}

// Start the game when page loads
window.onload = function () {
  initializeGrid();
  initEventListeners();
};
