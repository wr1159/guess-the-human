// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GuessTheHuman {
    struct GameBoard {
        uint256 rows;
        uint256 columns;
        uint8[][] map; // 0 = empty, 1 = wall, 2 = yellow point, 3 = red point
        address creator;
        bool active;
    }

    struct PlayerMove {
        address player;
        uint8[] moves; // L=0, R=1, U=2, D=3
        uint256 score;
        bool played;
        bool guessed;
    }

    mapping(uint256 => GameBoard) public gameBoards;
    mapping(uint256 => mapping(address => PlayerMove)) public playerMoves;
    uint256 public gameBoardCount;

    event GameBoardCreated(uint256 gameId, uint256 rows, uint256 columns, address creator);
    event MoveSubmitted(uint256 gameId, address player, uint8[] moves, uint256 score);

    // Function to Create a Game Board
    function createGameBoard(uint256 rows, uint256 columns, uint8[][] memory map) external {
        require(rows > 0 && columns > 0, "Invalid board dimensions");
        require(map.length == rows && map[0].length == columns, "Invalid map data");
        
        gameBoards[gameBoardCount] = GameBoard(rows, columns, map, msg.sender, true);
        emit GameBoardCreated(gameBoardCount, rows, columns, msg.sender);
        gameBoardCount++;
    }

    // Function to Submit Player Moves
    function submitPlay(uint256 gameId, uint8[] calldata moves) external {
        require(gameId < gameBoardCount, "Invalid game ID");
        require(gameBoards[gameId].active, "Game is not active");
        require(moves.length < 20, "At most 20 moves required");
        require(!playerMoves[gameId][msg.sender].played, "Player already submitted moves");

        uint256 score = 0;
        uint8[][] memory map = gameBoards[gameId].map;
        
        // Simulate movement and calculate score
        uint256 posX = 0;
        uint256 posY = 0;
        for (uint256 i = 0; i < moves.length; i++) {
            if (moves[i] == 0 && posX > 0) posX--; // Left
            if (moves[i] == 1 && posX < map.length - 1) posX++; // Right
            if (moves[i] == 2 && posY > 0) posY--; // Up
            if (moves[i] == 3 && posY < map[0].length - 1) posY++; // Down

            // Collect points or penalties
            if (map[posX][posY] == 2) {
                score++;
                map[posX][posY] = 0; // Remove collected yellow point
            } else if (map[posX][posY] == 3) {
                if (score > 0) {
                    score--; // Deduct points for red point
                }
                map[posX][posY] = 0; // Remove collected red point
            }
        }

        playerMoves[gameId][msg.sender] = PlayerMove(msg.sender, moves, score, true, false);
        emit MoveSubmitted(gameId, msg.sender, moves, score);
    }

    // Function to guess player if human
    function guessPlayer(uint256 gameId, address player, bool human) external {
        require(gameId < gameBoardCount, "Invalid game ID");
        require(playerMoves[gameId][player].played, "Player has not submitted moves");
        require(!playerMoves[gameId][player].guessed, "Player already guessed");
        playerMoves[gameId][player].guessed = true;
        if (human == true) {
            playerMoves[gameId][player].score -= 10;
        }
    }
}
