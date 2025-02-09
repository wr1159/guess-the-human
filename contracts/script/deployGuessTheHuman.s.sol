// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {GuessTheHuman} from "../src/GuessTheHuman.sol";

contract GuessTheHumanScript is Script {
    GuessTheHuman public guessTheHuman;

    address internal deployer;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        vm.label(deployer, "Deployer");
    }

    function run() public {
        vm.startBroadcast(deployer);
        guessTheHuman = new GuessTheHuman();
        uint8[][] memory board = new uint8[][](3);
        for (uint i = 0; i < 3; i++) {
            board[i] = new uint8[](3);
        }
        guessTheHuman.createGameBoard(3, 3, board);

        uint8[][] memory map = new uint8[][](5);
        for (uint256 i = 0; i < 5; i++) {
            map[i] = new uint8[](5);
            for (uint8 j = 0; j < 5; j++) {
                map[i][j] = 0;
            }
        }
        map[3][1] = 1; // Wall
        map[3][3] = 1; // Wall
        map[3][4] = 1; // Wall
        map[4][4] = 2; // Yellow ball (Positive point)
        map[1][3] = 2; // Yellow ball (Positive point)
        map[3][2] = 3; // Red ball (Negative point)
        guessTheHuman.createGameBoard(5, 5, map);
        uint8[] memory moves = new uint8[](20);
        for (uint8 i = 0; i < 20; i++) {
            if(i % 2 == 0) {
                moves[i] = 1;
            } else {
                moves[i] = 0;
            }
        }
        map[2][2] = 1;
        map[3][3] = 1;
        map[4][4] = 1;
        guessTheHuman.createGameBoard(5, 5, map);
        guessTheHuman.submitPlay(0, moves);
        vm.stopBroadcast();

    }
}
