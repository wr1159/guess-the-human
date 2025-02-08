"use client";
import { useChainId, useReadContract } from "wagmi";
import { useState, useEffect } from "react";
import { guessTheHumanAbi, guessTheHumanAddress } from "@/generated";

const GameBoard = ({ gameId }: { gameId: number }) => {
    const chainId = useChainId();
    const [rows, setRows] = useState<number>(0);
    const [cols, setCols] = useState<number>(0);
    const [board, setBoard] = useState<number[][]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch game board data
    const { data } = useReadContract({
        address:
            guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
        abi: guessTheHumanAbi,
        functionName: "gameBoards",
        args: [BigInt(gameId)],
    });
    console.log(data);
    // Fetch flattened board
    const { data: flatBoard } = useReadContract({
        address:
            guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
        abi: guessTheHumanAbi,
        functionName: "getFlatBoard",
        args: [BigInt(gameId)],
    });
    console.log(flatBoard);

    useEffect(() => {
        if (data && flatBoard) {
            const [rows, cols, ,] = data;
            setRows(Number(rows));
            setCols(Number(cols));

            // Convert 1D array to 2D
            const newBoard = [];
            for (let i = 0; i < rows; i++) {
                newBoard.push(
                    flatBoard
                        .slice(
                            Number(i) * Number(rows),
                            Number(i + 1) * Number(cols)
                        )
                        .map(Number)
                );
            }
            setBoard(newBoard);
            setIsLoading(false);
        }
    }, [data, flatBoard]);

    if (isLoading) return <p>Loading game board...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Game Board</h2>
            <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}
            >
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-10 h-10 flex items-center justify-center border ${
                                cell === 1
                                    ? "bg-gray-600" // Walls
                                    : cell === 2
                                      ? "text-yellow-500" // Yellow Points
                                      : cell === 3
                                        ? "text-red-500" // Red Points
                                        : "bg-gray-800 text-gray-300" // Empty
                            }`}
                        >
                            {cell === 1
                                ? "⬛"
                                : cell === 2
                                  ? "🟡"
                                  : cell === 3
                                    ? "🔴"
                                    : "⬜"}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GameBoard;
