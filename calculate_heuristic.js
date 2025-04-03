function boardHeuristic(goalX, goalY, gameGrid, gridSize) {
    let heuristicGrid = Array(gridSize)
      .fill()
      .map(() => Array(gridSize).fill(0));
    let queue = [[goalX, goalY]];
    let visited = new Set([`${goalX},${goalY}`]);
  
    for (let player of players) {
      gameGrid[player.y][player.x].isWall = false;
    }
  
    while (queue.length > 0) {
      let [row, col] = queue.shift();
  
      for (let direction of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) {
        let x = row;
        let y = col;
        let newX = row;
        let newY = col;
        let validMove = true;
        while (validMove) {
          newX += movement[direction].x;
          newY += movement[direction].y;
  
          if (
            newX >= 0 &&
            newX < gridSize &&
            newY >= 0 &&
            newY < gridSize &&
            isValidMove(x, y, newX, newY) &&
            !visited.has(`${newX},${newY}`)
          ) {
            visited.add(`${newX},${newY}`);
            heuristicGrid[newY][newX] = heuristicGrid[col][row] + 1;
            queue.push([newX, newY]);
            if (newX === 4 && newY === 1) {
              console.log([row, col]);
            }
            x = newX;
            y = newY;
          } else {
            validMove = false;
          }
        }
      }
  
      // break;
    }
    for (let player of players) {
      gameGrid[player.y][player.x].isWall = true;
    }
    console.log(heuristicGrid);
    return heuristicGrid;
  }