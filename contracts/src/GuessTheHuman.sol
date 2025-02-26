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
    mapping(uint256 => address[]) public gamePlayers; // Store players for each game
    mapping(address => uint256) public globalLeaderboard; // Store total scores per player
    address[] public leaderboardPlayers; // Track players who have played
    uint256 public gameBoardCount;

    event GameBoardCreated(uint256 gameId, uint256 rows, uint256 columns, address creator);
    event MoveSubmitted(uint256 gameId, address player, uint8[] moves, uint256 score);
    event LeaderboardReset();

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
        require(moves.length == 20, "20 moves required");
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
            if (map[posY][posX] == 2) {
                score += 10;
                map[posX][posY] = 0; // Remove collected yellow point
            } else if (map[posY][posX] == 3) {
                if (score > 0) {
                    score -= 5; // Deduct points for red point
                }
                map[posY][posX] = 0; // Remove collected red point
            }
        }

        gamePlayers[gameId].push(msg.sender); // Track players

        if (globalLeaderboard[msg.sender] == 0) {
            leaderboardPlayers.push(msg.sender); // Only add if first time playing
        }
        globalLeaderboard[msg.sender] += score;

        playerMoves[gameId][msg.sender] = PlayerMove(msg.sender, moves, score, true, false);
        emit MoveSubmitted(gameId, msg.sender, moves, score);
    }

    // Function to guess player if human
    function guessPlayer(uint256 gameId, address player, bool human) external {
        require(gameId < gameBoardCount, "Invalid game ID");
        require(playerMoves[gameId][player].played, "Player has not submitted moves");
        require(!playerMoves[gameId][msg.sender].guessed, "Player already guessed");
        playerMoves[gameId][player].guessed = true;
        if (human && playerMoves[gameId][player].score > 0) {
            // steal points if guessed correctly
            globalLeaderboard[player] -= playerMoves[gameId][player].score;
            if (globalLeaderboard[msg.sender] == 0) {
                leaderboardPlayers.push(msg.sender); // Only add if first time playing
            }
            globalLeaderboard[msg.sender] += playerMoves[gameId][player].score;
        }
    }

    // Function to return the entire board as a 1D array (flattened)
    function getFlatBoard(uint256 gameId) external view returns (uint8[] memory) {
        require(gameId < gameBoardCount, "Invalid game ID");
        GameBoard storage board = gameBoards[gameId];

        uint256 totalSize = board.rows * board.columns;
        uint8[] memory flatBoard = new uint8[](totalSize);

        for (uint256 i = 0; i < board.rows; i++) {
            for (uint256 j = 0; j < board.columns; j++) {
                flatBoard[i * board.columns + j] = board.map[i][j]; // Flatten row & col
            }
        }

        return flatBoard;
    }
    // Function to return a player's moves for a game
    function getPlayerMoves(uint256 gameId, address player) external view returns (uint8[] memory) {
        require(gameId < gameBoardCount, "Invalid game ID");
        require(playerMoves[gameId][player].played, "Player has not submitted moves");
        return playerMoves[gameId][player].moves;
    }

    // Function to return unguessed players for a game
    function getUnGuessedPlayers(uint256 gameId) external view returns (address[] memory) {
        require(gameId < gameBoardCount, "Invalid game ID");

        uint256 count = 0;
        for (uint256 i = 0; i < gamePlayers[gameId].length; i++) {
            if (!playerMoves[gameId][gamePlayers[gameId][i]].guessed) {
                count++;
            }
        }

        address[] memory unguessedPlayers = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < gamePlayers[gameId].length; i++) {
            if (!playerMoves[gameId][gamePlayers[gameId][i]].guessed) {
                unguessedPlayers[index] = gamePlayers[gameId][i];
                index++;
            }
        }

        return unguessedPlayers;
    }

    // Functon to return current running leaderboard
    function getLeaderboard() external view returns (address[] memory, uint256[] memory) {
        uint256 playerCount = leaderboardPlayers.length;
        address[] memory players = new address[](playerCount);
        uint256[] memory scores = new uint256[](playerCount);

        for (uint256 i = 0; i < playerCount; i++) {
            players[i] = leaderboardPlayers[i];
            scores[i] = globalLeaderboard[players[i]];
        }

        return (players, scores);
    }

    // Reset Leaderboard
    function resetLeaderboard() external {
        for (uint256 i = 0; i < leaderboardPlayers.length; i++) {
            globalLeaderboard[leaderboardPlayers[i]] = 0;
        }
        delete leaderboardPlayers;
        emit LeaderboardReset();
    }

}
