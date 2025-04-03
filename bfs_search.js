function bfsGrid2(grid) {
    const initialPositions = players.map((p) => [p.x, p.y]);
  
    let queue = [initialPositions];
    // let queue = [players.map((p) => [p.x, p.y])];
    let visited = new Set([
      `[${players.map((p) => `${p.x},${p.y}`).join(", ")}]`,
    ]);
    // visited = new Set([`[${player1.x},${player1.y}, ${player2.x},${player2.y}, ${player3.x},${player3.y}, ${player4.x},${player4.y}, ${player5.x},${player5.y}]`]);
    let count = 0;
    let winX, winY;
    while (count < 100000) {
      count++;
      // console.log(count);
      let positions = queue.shift();
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
  
          if (
            // Check if walkable
            !visited.has(`[${players.map((p) => `${p.x},${p.y}`).join(", ")}]`)
          ) {
            visited.add(`[${players.map((p) => `${p.x},${p.y}`).join(", ")}]`);
            const newPositions = players.map((p) => [p.x, p.y]);
            queue.push(newPositions);
            // console.log("new positions");
            // console.log(newPositions);
  
            // console.log("itt vagyok");
          }
          if (
            playerPosition.x === 1 &&
            playerPosition.y === 2 &&
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