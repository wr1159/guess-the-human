"use client";
import GuessingPage from "@/components/guess";
import { Spinner } from "@/components/ui/spinner";
import { guessTheHumanAbi, guessTheHumanAddress } from "@/generated";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useChainId, useReadContract } from "wagmi";

export default function Home() {
    // use paramquery
    const searchParams = useSearchParams();
    const id = parseInt(searchParams.get("id") || "1");

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
    // Fetch unguessed Player
    const { data: unGuessedPlayerArray } = useReadContract({
        address:
            guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
        abi: guessTheHumanAbi,
        functionName: "getUnGuessedPlayers",
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

    if (isLoading || !unGuessedPlayerArray)
        return (
            <div className="max-w-5xl w-screen h-screen flex items-center justify-center mx-auto">
                <Spinner size="xl" />
            </div>
        );
    if (unGuessedPlayerArray?.length === 0) {
        return (
            <div className="max-w-5xl w-screen h-screen flex items-center justify-center mx-auto flex-col">
                <h1 className="text-3xl font-bold">
                    There are no current players
                </h1>
                <p className="text-lg">
                    Please check back later for more games.
                </p>
            </div>
        );
    }
    return (
        <div className="container max-w-5xl mx-auto p-6 items-center justify-center grid space-x-6">
            <GuessingPage
                gameId={id}
                player={unGuessedPlayerArray?.[0]}
                gameData={gameData}
                flatBoard={flatBoard}
            />
        </div>
    );
}
