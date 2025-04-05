/**
 * Rotates a square board 90 degrees clockwise and adjusts directional characters
 * @param {Array<Array<string|number>>} board - The board to rotate
 * @return {Array<Array<string|number>>} - The rotated board
 */
function rotateBoard90Clockwise(board) {
    const n = board.length;
    const rotatedBoard = Array(n).fill().map(() => Array(n).fill(0));
    
    // Create rotated board
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        rotatedBoard[col][n - 1 - row] = board[row][col];
      }
    }
    
    // Adjust the directional characters
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        const cell = rotatedBoard[row][col];
        if (typeof cell === 'string') {
          switch (cell) {
            case 'T': rotatedBoard[row][col] = 'R'; break;
            case 'R': rotatedBoard[row][col] = 'B'; break;
            case 'B': rotatedBoard[row][col] = 'L'; break;
            case 'L': rotatedBoard[row][col] = 'T'; break;
            default: break;
          }
        }
      }
    }
    
    return rotatedBoard;
  }
  
  /**
   * Rotates a square board by the specified number of 90-degree clockwise turns
   * @param {Array<Array<string|number>>} board - The board to rotate
   * @param {number} turns - Number of 90-degree clockwise rotations (0-3)
   * @return {Array<Array<string|number>>} - The rotated board
   */
  function rotateBoard(board, turns = 1) {
    turns = turns % 4; // Normalize to 0-3 turns
    
    if (turns === 0) return board;
    
    let rotatedBoard = [...board.map(row => [...row])]; // Create a deep copy
    
    for (let i = 0; i < turns; i++) {
      rotatedBoard = rotateBoard90Clockwise(rotatedBoard);
    }
    
    return rotatedBoard;
  }
  
  // Example usage:
  const quarterBoard = [
    [0, "R", 0, 0, "B", 0, 0, 0],
    [0, "B", 0, "R", 0, 0, 0, 0],
    [0, 0, "L", 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, "L"],
    [0, 0, 0, 0, 0, 0, "T", 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, "R", 0, 0, 0, 0, 0],
    [0, 0, 0, "T", 0, 0, 0, 0]
  ];
  
  // Get rotations
  const rotated90 = rotateBoard(quarterBoard, 1);
  const rotated180 = rotateBoard(quarterBoard, 2);
  const rotated270 = rotateBoard(quarterBoard, 3);
  
  // Print the results
  console.log("Original Board:");
  console.log(quarterBoard.map(row => JSON.stringify(row)).join('\n'));
  
  console.log("\n90° Clockwise Rotation:");
  console.log(rotated90.map(row => JSON.stringify(row)).join('\n'));
  
  console.log("\n180° Rotation:");
  console.log(rotated180.map(row => JSON.stringify(row)).join('\n'));
  
  console.log("\n270° Clockwise Rotation:");
  console.log(rotated270.map(row => JSON.stringify(row)).join('\n'));