"use client";
import { useState, useEffect } from "react";
import { useChainId, useReadContract, useWriteContract } from "wagmi";
import { guessTheHumanAbi, guessTheHumanAddress } from "@/generated";
import { Button } from "@/components/ui/button";

const MOVE_MAP = ["L", "R", "U", "D"];

const GuessingPage = ({
    gameId,
    player,
}: {
    gameId: number;
    player: string;
}) => {
    const chainId = useChainId();
    const [board, setBoard] = useState<number[][]>([]);
    const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
    const [aiMoves, setAiMoves] = useState<string[]>([]);
    const [playerMoves, setPlayerMoves] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [guess, setGuess] = useState<boolean | null>(null);

    const { data: playerMovesData } = useReadContract({
        address:
            guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
        abi: guessTheHumanAbi,
        functionName: "getPlayerMoves",
        args: [BigInt(gameId), player as `0x${string}`],
    });

    useEffect(() => {
        if (playerMovesData) {
            console.log(playerMovesData);
            setPlayerMoves(playerMovesData.map((m: number) => MOVE_MAP[m]));
            setAiMoves(
                Array.from(
                    { length: 20 },
                    () => MOVE_MAP[Math.floor(Math.random() * 4)]
                )
            );
            setIsLoading(false);
        }
    }, [playerMovesData]);

    const nextMove = () => {
        if (currentStep < 20) {
            const move = playerMoves[currentStep];
            const aiMove = aiMoves[currentStep];

            setPlayerPos((prev) => movePlayer(prev, move));
            setCurrentStep((prev) => prev + 1);
        }
    };

    const movePlayer = (pos: { row: number; col: number }, move: string) => {
        let newRow = pos.row,
            newCol = pos.col;
        if (move === "L") newCol--;
        if (move === "R") newCol++;
        if (move === "U") newRow--;
        if (move === "D") newRow++;
        return { row: newRow, col: newCol };
    };

    const { writeContract } = useWriteContract();
    const submitGuess = async () => {
        if (guess === null) return;
        await writeContract({
            address:
                guessTheHumanAddress[
                    chainId as keyof typeof guessTheHumanAddress
                ],
            abi: guessTheHumanAbi,
            functionName: "guessPlayer",
            args: [BigInt(gameId), player as `0x${string}`, guess],
        });
    };

    if (isLoading) return <p>Loading game data...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Guess The Human</h2>
            <p>Step: {currentStep}/20</p>
            <div className="grid grid-cols-2 gap-4">
                <Button onClick={nextMove} disabled={currentStep >= 20}>
                    Next Move
                </Button>
                <Button onClick={() => setGuess(true)}>Guess Human</Button>
                <Button onClick={() => setGuess(false)}>Guess AI</Button>
                <Button onClick={submitGuess} disabled={guess === null}>
                    Submit Guess
                </Button>
            </div>
        </div>
    );
};

export default GuessingPage;
