"use client";
import { useState, useEffect } from "react";
import { useChainId, useReadContract, useWriteContract } from "wagmi";
import { guessTheHumanAbi, guessTheHumanAddress } from "@/generated";
import { Button } from "@/components/ui/button";
import { generateAINextMove, MOVE } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MOVE_MAP = ["L", "R", "U", "D"];

const EMOJI_LIST = [
    "🦄",
    "😹",
    "🌽",
    "🍑",
    "🐸",
    "💩",
    "🔥",
    "💎",
    "🌮",
    "🎲",
    "🍣",
    "🍆",
    "👽",
    "🥨",
    "👑",
];

const GuessingPage = ({
    gameId,
    player,
    gameData,
    flatBoard,
}: {
    gameId: number;
    player: string;
    gameData: readonly [bigint, bigint, `0x${string}`, boolean] | undefined;
    flatBoard: number[];
}) => {
    const { toast } = useToast();
    const chainId = useChainId();
    const [cols, setCols] = useState<number>(0);
    const [board, setBoard] = useState<number[][]>([]);
    const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
    const [aiPos, setAiPos] = useState({ row: 0, col: 0 });
    const [aiMoves, setAiMoves] = useState<string[]>([]);
    const [playerMoves, setPlayerMoves] = useState<string[]>([]);
    const [playerScore, setPlayerScore] = useState<number>(0);
    const [aiScore, setAiScore] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<number>(0);
    // count number of 2s
    const maximumScore = flatBoard.filter((cell) => cell === 2).length * 10;

    const [playerEmoji] = useState<string>(
        EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)]
    );
    const [otherEmoji] = useState<string>(() => {
        let emoji = EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
        while (emoji === playerEmoji) {
            emoji = EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
        }
        return emoji;
    });

    useEffect(() => {
        if (gameData && flatBoard) {
            const [rows, cols, ,] = gameData;
            setCols(Number(cols));

            const newBoard = [];
            for (let i = 0; i < rows; i++) {
                newBoard.push(
                    flatBoard
                        .slice(
                            Number(i) * Number(cols),
                            Number(i + 1) * Number(cols)
                        )
                        .map(Number)
                );
            }
            setBoard(newBoard);
        }
    }, [gameData, flatBoard]);

    const { data: playerMovesData } = useReadContract({
        address:
            guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
        abi: guessTheHumanAbi,
        functionName: "getPlayerMoves",
        args: [BigInt(gameId), player as `0x${string}`],
    });

    useEffect(() => {
        if (playerMovesData) {
            setPlayerMoves(playerMovesData.map((m: number) => MOVE_MAP[m]));
            const currentPosition = { row: 0, col: 0 };
            for (let i = 0; i < 20; i++) {
                const aiMove = generateAINextMove(i, currentPosition, board);
                switch (aiMove) {
                    case MOVE.L:
                        currentPosition.col--;
                        break;
                    case MOVE.R:
                        currentPosition.col++;
                        break;
                    case MOVE.U:
                        currentPosition.row--;
                        break;
                    case MOVE.D:
                        currentPosition.row++;
                        break;
                    default:
                        break;
                }
                // convert to string aiMOVe
                const aiMoveStr = MOVE_MAP[aiMove];
                setAiMoves((prev) => [...prev, aiMoveStr]);
            }
        }
    }, [playerMovesData, board]);

    const nextMove = () => {
        if (currentStep < 20) {
            const move = playerMoves[currentStep];
            const aiMove = aiMoves[currentStep];

            setPlayerPos((prev) => movePlayer(prev, move));
            setAiPos((prev) => movePlayer(prev, aiMove));
            setCurrentStep((prev) => prev + 1);
            // Calculate the player score
            if (board[playerPos.row][playerPos.col] === 2) {
                setPlayerScore((prev) => Math.max(0, prev + 10));
            } else if (board[playerPos.row][playerPos.col] === 3) {
                setPlayerScore((prev) => Math.max(0, prev - 5));
            }

            // calcualte the AI score
            if (board[aiPos.row][aiPos.col] === 2) {
                setAiScore((prev) => Math.max(0, prev + 10));
            } else if (board[aiPos.row][aiPos.col] === 3) {
                setAiScore((prev) => Math.max(0, prev - 5));
            }
        }
    };

    const undoMove = () => {
        if (currentStep > 0) {
            const move = playerMoves[currentStep - 1];
            const aiMove = aiMoves[currentStep - 1];

            setPlayerPos((prev) => unmovePlayer(prev, move));
            setAiPos((prev) => unmovePlayer(prev, aiMove));
            setCurrentStep((prev) => prev - 1);
        }

        // Calculate the player score
        if (board[playerPos.row][playerPos.col] === 2) {
            setPlayerScore((prev) => Math.max(0, prev - 10));
        } else if (board[playerPos.row][playerPos.col] === 3) {
            setPlayerScore((prev) => Math.max(0, prev + 5));
        }

        // calcualte the AI score
        if (board[aiPos.row][aiPos.col] === 2) {
            setAiScore((prev) => Math.max(0, prev - 10));
        } else if (board[aiPos.row][aiPos.col] === 3) {
            setAiScore((prev) => Math.max(0, prev + 5));
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
    const unmovePlayer = (pos: { row: number; col: number }, move: string) => {
        let newRow = pos.row,
            newCol = pos.col;
        if (move === "L") newCol++;
        if (move === "R") newCol--;
        if (move === "U") newRow++;
        if (move === "D") newRow--;
        return { row: newRow, col: newCol };
    };

    const { writeContract } = useWriteContract();
    const submitGuess = async (guess: boolean) => {
        await writeContract({
            address:
                guessTheHumanAddress[
                    chainId as keyof typeof guessTheHumanAddress
                ],
            abi: guessTheHumanAbi,
            functionName: "guessPlayer",
            args: [BigInt(gameId), player as `0x${string}`, guess],
        });

        setTimeout(() => {
            if (guess)
                toast({
                    title: "Success, Picked the right player",
                });
            else {
                toast({
                    title: "Wrong guess",
                });
            }
        }, 10000);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 font-mono text-center ">
                Guess Player <br />
                {player.slice(0, 6)}...{player.slice(-4)}
            </h2>
            <div className="border rounded-lg p-2 flex flex-col items-center">
                <p className="text-ring uppercase font-mono">Moves Left:</p>
                <p className="text-2xl">{currentStep}/20</p>
            </div>
            <div className="grid grid-cols-2 mt-2">
                <div className="border rounded-lg p-2 flex flex-col items-center">
                    <p className="text-ring uppercase font-mono">
                        {playerEmoji} Score
                    </p>
                    <p className="text-2xl">
                        {playerScore > maximumScore
                            ? maximumScore
                            : playerScore}
                    </p>
                </div>
                <div className="border rounded-lg p-2 flex flex-col items-center">
                    <p className="text-ring uppercase font-mono">
                        {otherEmoji} Score
                    </p>
                    <p className="text-2xl">
                        {aiScore > maximumScore ? maximumScore : aiScore}
                    </p>
                </div>
            </div>
            <div className="grid gap-8 pt-2">
                <div>
                    <div
                        className="grid"
                        style={{ gridTemplateColumns: `repeat(${cols}, 80px)` }}
                    >
                        {board.map((row, rowIndex) =>
                            row.map((cell, colIndex) => {
                                let entity = "";
                                if (
                                    playerPos.row === rowIndex &&
                                    playerPos.col === colIndex
                                ) {
                                    entity += playerEmoji;
                                }
                                if (
                                    aiPos.row === rowIndex &&
                                    aiPos.col === colIndex
                                ) {
                                    entity += otherEmoji;
                                }
                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={
                                            "w-20 h-20 flex items-center justify-center border bg-muted text-3xl"
                                        }
                                    >
                                        {entity ||
                                            (cell === 1
                                                ? "🪨"
                                                : cell === 2
                                                  ? "🟡"
                                                  : cell === 3
                                                    ? "🔴"
                                                    : "⬜")}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <Button onClick={nextMove} disabled={currentStep >= 20}>
                    Next Move
                </Button>
                <Button onClick={undoMove} disabled={currentStep === 0}>
                    Undo Move
                </Button>
            </div>
            {/* 50% chance of flipping the order */}
            <div
                className={`grid gap-4 mt-4 grid-cols-2 ${Math.random() > 0.5 ? "reversed" : ""}`}
            >
                <Button onClick={() => submitGuess(true)}>
                    Guess {playerEmoji}
                </Button>
                <Button onClick={() => submitGuess(false)}>
                    Guess {otherEmoji}
                </Button>
            </div>
        </div>
    );
};

export default GuessingPage;
