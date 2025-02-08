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
        vm.stopBroadcast();
    }
}
