"use client";
import { useState, useEffect } from "react";
import { useChainId, useReadContract } from "wagmi";
import { guessTheHumanAbi, guessTheHumanAddress } from "@/generated";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";
import { Spinner } from "./ui/spinner";

const Leaderboard = () => {
    const chainId = useChainId();
    const [players, setPlayers] = useState<string[]>([]);
    const [scores, setScores] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { data: leaderboardData } = useReadContract({
        address:
            guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
        abi: guessTheHumanAbi,
        functionName: "getLeaderboard",
    });

    useEffect(() => {
        if (leaderboardData) {
            const [playerAddresses, playerScores] = leaderboardData;
            setPlayers(playerAddresses.map(String));
            setScores(playerScores.map(Number));
            setIsLoading(false);
        }
    }, [leaderboardData]);

    if (isLoading)
        return (
            <div className="max-w-5xl w-screen h-screen flex items-center justify-center mx-auto">
                <Spinner size="xl" />
            </div>
        );

    return (
        <div className="p-6">
            <h2 className="text-center text-2xl font-semibold mb-4">
                Global Leaderboard
            </h2>
            <div className="border rounded-lg p-4">
                {players.length === 0 ? (
                    <p>No scores yet.</p>
                ) : (
                    <Table className="w-full text-left border-collapse">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border-b p-2">
                                    Player
                                </TableHead>
                                <TableHead className="border-b p-2">
                                    Score
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players
                                .map((player, index) => ({
                                    player,
                                    score: scores[index],
                                }))
                                .sort((a, b) => b.score - a.score) // Sort by highest score
                                .map(({ player, score }) => (
                                    <tr key={player}>
                                        <td className="p-2">{player}</td>
                                        <td className="p-2">{score}</td>
                                    </tr>
                                ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
