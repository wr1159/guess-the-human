// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {GuessTheHuman} from "../src/GuessTheHuman.sol";

contract GuessTheHumanTest is Test {
    GuessTheHuman public guessTheHuman;
    address public player1;
    address public player2;
    address public guesser;

    function setUp() public {
        guessTheHuman = new GuessTheHuman();
        player1 = address(0x123);
        player2 = address(0x456);
        guesser = address(0x789);
    }

    function testCreateGameBoard() public {
        uint8[][] memory map = new uint8[][](5);
        for (uint256 i = 0; i < 5; i++) {
            map[i] = new uint8[](5);
            for (uint8 j = 0; j < 5; j++) {
                map[i][j] = 0;
            }
        }
        map[1][1] = 1; // Wall
        map[2][2] = 2; // Yellow ball (Positive point)
        map[3][3] = 3; // Red ball (Negative point)
        

        guessTheHuman.createGameBoard(5, 5, map);
        (uint256 rows, uint256 cols,  address creator, bool active) = guessTheHuman.gameBoards(0);
        
        assertEq(rows, 5);
        assertEq(cols, 5);
        assertEq(creator, address(this));
        assertEq(active, true);
    }

    function testSubmitPlay() public {
        uint8[][] memory map = new uint8[][](5);
        for (uint256 i = 0; i < 5; i++) {
            map[i] = new uint8[](5);
            for (uint8 j = 0; j < 5; j++) {
                map[i][j] = 0;
            }
        }
        map[2][2] = 2; // Yellow ball
        map[3][3] = 3; // Red ball
        
        guessTheHuman.createGameBoard(5, 5, map);

        uint8[] memory moves = new uint8[](5);
        moves[0] = 1; // Right
        moves[2] = 3; // Down
        moves[1] = 1; // Right
        moves[3] = 3; // Down
        moves[4] = 2; // Up

        vm.prank(player1);
        guessTheHuman.submitPlay(0, moves);

        (address player, uint256 score, bool played, ) = guessTheHuman.playerMoves(0, player1);
        assertEq(player, player1);
        assertEq(score, 1); // Should have collected a yellow ball
        assertEq(played, true);
    }

    function testGuessPlayer() public {
        uint8[][] memory map = new uint8[][](5);
        for (uint256 i = 0; i < 5; i++) {
            map[i] = new uint8[](5);
            for (uint8 j = 0; j < 5; j++) {
                map[i][j] = 0;
            }
        }
        map[2][2] = 2; // Yellow ball
        map[3][3] = 3; // Red ball
        
        guessTheHuman.createGameBoard(5, 5, map);
        
        uint8[] memory moves = new uint8[](5);
        moves[0] = 1; // Right
        moves[2] = 3; // Down
        moves[1] = 1; // Right
        moves[3] = 3; // Down
        moves[4] = 2; // Up
        
        vm.prank(player1);
        guessTheHuman.submitPlay(0, moves);
        
        vm.prank(guesser);
        guessTheHuman.guessPlayer(0, player1, true);
        
        ( , uint256 score, , bool guessed) = guessTheHuman.playerMoves(0, player1);
        assertEq(guessed, true);
        assertEq(score, 0); // Since guessing correctly deducts 10 points
    }
}
