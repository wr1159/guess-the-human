"use client";
import { useChainId, useWriteContract } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { guessTheHumanAbi, guessTheHumanAddress } from "@/generated";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const DIRECTIONS = {
    ArrowUp: "U",
    ArrowDown: "D",
    ArrowLeft: "L",
    ArrowRight: "R",
    w: "U",
    s: "D",
    a: "L",
    d: "R",
};

const MOVE_MAP = { L: 0, R: 1, U: 2, D: 3 };

const GameBoard = ({
    gameId,
    gameData,
    flatBoard,
}: {
    gameId: number;
    gameData: readonly [bigint, bigint, `0x${string}`, boolean] | undefined;
    flatBoard: number[];
}) => {
    const chainId = useChainId();
    const { toast } = useToast();
    const [rows, setRows] = useState<number>(0);
    const [cols, setCols] = useState<number>(0);
    const [board, setBoard] = useState<number[][]>([]);
    const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
    const [moves, setMoves] = useState<string[]>([]);
    const [score, setScore] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [prevBoardStates, setPrevBoardStates] = useState<
        {
            board: number[][];
            pos: { row: number; col: number };
            score: number;
        }[]
    >([]);

    const { writeContract } = useWriteContract();

    useEffect(() => {
        if (gameData && flatBoard) {
            const [rows, cols, ,] = gameData;
            setRows(Number(rows));
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

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const direction = DIRECTIONS[event.key as keyof typeof DIRECTIONS];
            if (!direction || moves.length >= 20) return;

            const { row, col } = playerPos;
            let newRow = row,
                newCol = col;

            if (direction === "L") newCol--;
            if (direction === "R") newCol++;
            if (direction === "U") newRow--;
            if (direction === "D") newRow++;

            if (
                newRow < 0 ||
                newRow >= rows ||
                newCol < 0 ||
                newCol >= cols ||
                board[newRow][newCol] === 1
            ) {
                return;
            }

            setPrevBoardStates((prev) => [
                ...prev,
                {
                    board: board.map((row) => [...row]),
                    pos: { row, col },
                    score,
                },
            ]);

            if (board[newRow][newCol] === 2) {
                setScore((prevScore) => prevScore + 1);
            } else if (board[newRow][newCol] === 3) {
                setScore((prevScore) => Math.max(0, prevScore - 1));
            }

            const updatedBoard = board.map((r, i) =>
                r.map((c, j) => (i === newRow && j === newCol ? 0 : c))
            );
            setBoard(updatedBoard);
            setPlayerPos({ row: newRow, col: newCol });
            setMoves((prevMoves) => [...prevMoves, direction]);
        },
        [playerPos, moves, cols, rows, board]
    );
    const simulateKeyPress = (key: string) => {
        handleKeyDown({ key } as KeyboardEvent);
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const moveData = moves.map(
        (move) => MOVE_MAP[move as keyof typeof MOVE_MAP]
    );

    const undoMove = () => {
        if (moves.length === 0 || prevBoardStates.length === 0) return;
        setMoves((prevMoves) => prevMoves.slice(0, -1));
        const lastState = prevBoardStates[prevBoardStates.length - 1];
        setBoard(lastState.board.map((row) => [...row]));
        setPlayerPos({ ...lastState.pos });
        setScore(lastState.score);
        setPrevBoardStates((prev) => prev.slice(0, -1));
    };

    const submitMoves = async () => {
        if (moves.length === 0) return;
        setIsSubmitting(true);
        try {
            await writeContract({
                address:
                    guessTheHumanAddress[
                        chainId as keyof typeof guessTheHumanAddress
                    ],
                abi: guessTheHumanAbi,
                functionName: "submitPlay",
                args: [BigInt(gameId), moveData],
            });
            setInterval(() => {
                toast({
                    title: "Moves submitted successfully.",
                });
            });
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Error submitting moves.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="p-6 mx-auto">
            <h2 className="text-2xl font-semibold mb-2">Can You Blend In?</h2>
            <div className="grid grid-cols-2 space-x-4 py-2">
                <div className="border rounded-lg p-2 flex flex-col items-center">
                    <p className="text-ring uppercase font-mono">Score:</p>
                    <p className="text-2xl">{score}</p>
                </div>
                <div className="border rounded-lg p-2 flex flex-col items-center">
                    <p className="text-ring uppercase font-mono">Moves Left:</p>
                    <p className="text-2xl">{20 - moves.length}</p>
                </div>
            </div>
            <div
                className="grid rounded-lg"
                style={{ gridTemplateColumns: `repeat(${cols}, 80px)` }}
            >
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={
                                "w-20 h-20 flex items-center justify-center border bg-muted text-3xl"
                            }
                        >
                            {rowIndex === playerPos.row &&
                            colIndex === playerPos.col
                                ? "🚀"
                                : cell === 1
                                  ? "🪨"
                                  : cell === 2
                                    ? "🟡"
                                    : cell === 3
                                      ? "🔴"
                                      : "⬜"}
                        </div>
                    ))
                )}
            </div>
            <div className="mt-4">
                <div className="border rounded-lg p-2 flex flex-col items-center w-full">
                    <p className="text-ring uppercase font-mono">
                        Movement Recorded:
                    </p>
                    <p className="text-base break-words">
                        {moves.join(" ") || "No moves recorded yet."}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 md:hidden">
                <Button
                    onClick={() => simulateKeyPress("ArrowUp")}
                    className="col-span-2"
                >
                    ⬆️
                </Button>
                <Button
                    onClick={() => simulateKeyPress("ArrowLeft")}
                    className="col-span-1"
                >
                    ⬅️
                </Button>
                <Button
                    onClick={() => simulateKeyPress("ArrowRight")}
                    className="col-span-1"
                >
                    ➡️
                </Button>
                <Button
                    onClick={() => simulateKeyPress("ArrowDown")}
                    className="col-span-2"
                >
                    ⬇️
                </Button>
            </div>
            {/* Undo Move */}
            <Button
                onClick={undoMove}
                disabled={moves.length === 0 || isSubmitting}
                className="mt-2 w-full"
                variant="secondary"
            >
                Undo Move
            </Button>
            <Button
                onClick={submitMoves}
                disabled={isSubmitting || moves.length !== 20}
                className="mt-2 w-full"
            >
                {isSubmitting ? "Submitting..." : "Submit Moves"}
            </Button>
        </div>
    );
};

export default GameBoard;
