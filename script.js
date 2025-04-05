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

  // Toggle the wall
  if (gameGrid[y][x].walls[direction]) {
    gameGrid[y][x].walls[direction] = false;
    removeWall(cell, direction);
  } else {
    gameGrid[y][x].walls[direction] = true;
    addWall(cell, direction);
  }
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
  }
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

  // Check if the new position is valid
  let direction = getRelativeDirection(
    playerPosition.x,
    playerPosition.y,
    x,
    y
  );
  attemptMove(playerPosition.x, playerPosition.y, direction);
}

function attemptMove(newX, newY, direction) {

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
      x = newX;
      y = newY;
    } else {
      playerPosition.x = x;
      playerPosition.y = y;
      gameGrid[playerPosition.y][playerPosition.x].isWall = true;
      return;

    }
  }
  gameGrid[playerPosition.y][playerPosition.x].isWall = true;
}


function setAllPlayersPositions(players, positions) {
  for (let i = 0; i < players.length; i++) {
    gameGrid[players[i].y][players[i].x].isWall = false;
    players[i].x = positions[i][0];
    players[i].y = positions[i][1];
    gameGrid[players[i].y][players[i].x].isWall = true;
  }
}

function calculatedHeuristic(heuristicBoard, player) {
  return heuristicBoard[player.y][player.x];
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


  if (event.key === "h") {
    // boardHeuristic(1, 1, gameGrid, gridSize);
    aStar(player2, 5, 8, "player2");
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

  const currentPlayer = selectedPlayer;
  const currentPosition = playerPosition;

  for (let i = 0; i < players.length; i++) {
    playerPosition = players[i];
    placePlayer(players[i].x, players[i].y, `player${i + 1}`);
  }
  selectedPlayer = currentPlayer;
  playerPosition = currentPosition;
  event.preventDefault();
}

// Reset the game
function resetGame() {
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
