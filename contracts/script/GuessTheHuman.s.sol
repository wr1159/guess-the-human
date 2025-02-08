// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {GuessTheHuman} from "../src/GuessTheHuman.sol";

contract GuessTheHumanScript is Script {
    GuessTheHuman public guessTheHuman;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        guessTheHuman = new GuessTheHuman();

        vm.stopBroadcast();
    }
}
