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
        // console.log("currentNodes");
        // console.log(currentNodes);
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