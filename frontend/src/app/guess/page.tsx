"use client";
import GuessingPage from "@/components/guess";
import { guessTheHumanAbi, guessTheHumanAddress } from "@/generated";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useChainId, useReadContract } from "wagmi";

export default function Home() {
    // use paramquery
    const searchParams = useSearchParams();
    const id = parseInt(searchParams.get("id") || "1");
    const player =
        searchParams.get("player") ||
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    const chainId = useChainId();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [gameData, setGameData] = useState<
        readonly [bigint, bigint, `0x${string}`, boolean] | undefined
    >(undefined);
    const [flatBoard, setFlatBoard] = useState<number[]>([]);

    // Fetch game board metadata
    const { data: gameBoard } = useReadContract({
        address:
            guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
        abi: guessTheHumanAbi,
        functionName: "gameBoards",
        args: [BigInt(id)],
    });

    // Fetch flattened board
    const { data: fetchedFlatBoard } = useReadContract({
        address:
            guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
        abi: guessTheHumanAbi,
        functionName: "getFlatBoard",
        args: [BigInt(id)],
    });

    // Once both fetches complete, update state
    useEffect(() => {
        if (gameBoard && fetchedFlatBoard) {
            setGameData(gameBoard);
            setFlatBoard(fetchedFlatBoard.map(Number));
            setIsLoading(false);
        }
    }, [gameBoard, fetchedFlatBoard]);

    if (isLoading) return <p>Loading game data...</p>;
    return (
        <div className="container max-w-5xl mx-auto p-6 items-center justify-center grid space-x-6">
            <GuessingPage
                gameId={id}
                player={player}
                gameData={gameData}
                flatBoard={flatBoard}
            />
        </div>
    );
}
