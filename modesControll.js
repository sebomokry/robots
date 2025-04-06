// Constants for better readability
const MODES = {
    MOVE: 'move',
    WALL: 'wall',
    SOLVER: 'solver'
  };
  
  // Element references for better performance and cleaner code
  const elements = {
    resetBtn: document.getElementById("reset-btn"),
    toggleSolverBtn: document.getElementById("toggle-solver-btn"),
    toggleModeBtn: document.getElementById("toggle-mode-btn"),
    clearWallsBtn: document.getElementById("clear-walls-btn"),
    wallLeftBtn: document.getElementById("wall-left-btn"),
    wallRightBtn: document.getElementById("wall-right-btn"),
    wallTopBtn: document.getElementById("wall-top-btn"),
    wallBottomBtn: document.getElementById("wall-bottom-btn"),
    solverControls: document.getElementById('solver-controls'),
    wallControls: document.getElementById("wall-controls"),
    modeIndicator: document.getElementById("mode-indicator"),
    solverButton: document.getElementById("solver-btn"),
  };
  
  // Mode indicator styling configurations
  const modeStyles = {
    [MODES.MOVE]: {
      text: "Mode: Move Player",
      bgColor: "#f8d7da",
      borderColor: "#f5c6cb",
      textColor: "#721c24"
    },
    [MODES.WALL]: {
      text: "Mode: Wall Creation",
      bgColor: "#d4edda",
      borderColor: "#c3e6cb",
      textColor: "#155724"
    },
    [MODES.SOLVER]: {
      text: "Mode: Solver",
      bgColor: "#cce5ff",
      borderColor: "#b8daff",
      textColor: "#004085"
    }
  };
  
  // Current game mode
  let currentMode = MODES.MOVE;
  
  // Function to update mode indicator display
  function updateModeIndicator(mode) {
    const style = modeStyles[mode];
    elements.modeIndicator.textContent = style.text;
    elements.modeIndicator.style.backgroundColor = style.bgColor;
    elements.modeIndicator.style.borderColor = style.borderColor;
    elements.modeIndicator.style.color = style.textColor;
  }
  
  // Function to switch to player movement mode
  function switchToMoveMode() {
    currentMode = MODES.MOVE;
    elements.toggleModeBtn.textContent = "Switch to Wall Creation Mode";
    elements.toggleSolverBtn.textContent = "Solver Mode";
    elements.wallControls.style.display = "none";
    elements.solverControls.style.display = "none";
    elements.toggleModeBtn.style.display = "flex";
    elements.toggleSolverBtn.style.display = "block";
    updateModeIndicator(MODES.MOVE);
  }
  
  // Function to switch to wall creation mode
  function switchToWallMode() {
    currentMode = MODES.WALL;
    elements.toggleModeBtn.textContent = "Switch to Player Movement Mode";
    elements.wallControls.style.display = "flex";
    elements.solverControls.style.display = "none";
    elements.toggleSolverBtn.style.display = "none";
    updateModeIndicator(MODES.WALL);
  }
  
  // Function to switch to solver mode
  function switchToSolverMode() {
    currentMode = MODES.SOLVER;
    elements.toggleSolverBtn.textContent = "Switch to Player Movement Mode";
    elements.solverControls.style.display = "block";
    elements.toggleModeBtn.style.display = "none";
    updateModeIndicator(MODES.SOLVER);
  }
  
  // Toggle game mode between player movement and wall creation
  function toggleGameMode() {
    if (currentMode === MODES.MOVE) {
      switchToWallMode();
    } else {
      switchToMoveMode();
    }
  }
  
  // Toggle solver mode
  function toggleSolverMode() {
    if (elements.solverControls.style.display === 'none') {
      switchToSolverMode();
    } else {
      switchToMoveMode();
    }
  }
  
  // Initialize all event listeners
  function initEventListeners() {
    // Main control buttons
    elements.resetBtn.addEventListener("click", resetGame);
    elements.toggleSolverBtn.addEventListener("click", toggleSolverMode);
    elements.toggleModeBtn.addEventListener("click", toggleGameMode);
    elements.clearWallsBtn.addEventListener("click", clearAllWalls);
  
    // Solver button
    elements.solverButton.addEventListener("click", () => {
      // Assuming you have a function to start the solver
      const hKeyEvent = new KeyboardEvent("keydown", {
        key: "h",
        code: "KeyH",
        keyCode: 72,  // ASCII code for "h"
        which: 72,
        bubbles: true,
        cancelable: true
      });
      
      // Dispatch the event to the document
      document.dispatchEvent(hKeyEvent);
    });
    // Wall direction buttons
    elements.wallLeftBtn.addEventListener("click", () => setWallDirection("left"));
    elements.wallRightBtn.addEventListener("click", () => setWallDirection("right"));
    elements.wallTopBtn.addEventListener("click", () => setWallDirection("top"));
    elements.wallBottomBtn.addEventListener("click", () => setWallDirection("bottom"));
  }