"use client";
import GameBoard from "@/components/gameboard";
import { HowToPlayHuman } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { guessTheHumanAbi, guessTheHumanAddress } from "@/generated";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useChainId, useReadContract } from "wagmi";

export default function Play() {
    const searchParams = useSearchParams();
    const id = parseInt(searchParams.get("id") || "1");
    const chainId = useChainId();
    const account = useAccount();
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
    const { data: playerMovesData } = useReadContract({
        address:
            guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
        abi: guessTheHumanAbi,
        functionName: "getPlayerMoves",
        args: [BigInt(id), account.address as `0x${string}`],
    });

    // Once both fetches complete, update state
    useEffect(() => {
        if (gameBoard && fetchedFlatBoard) {
            setGameData(gameBoard);
            setFlatBoard(fetchedFlatBoard.map(Number));
            setIsLoading(false);
        }
    }, [gameBoard, fetchedFlatBoard]);

    // useWatchContractEvent({
    //     address:
    //         guessTheHumanAddress[chainId as keyof typeof guessTheHumanAddress],
    //     abi: guessTheHumanAbi,
    //     eventName: "MoveSubmitted",
    //     onLogs(logs) {
    //         console.log("New logs!", logs);
    //     },
    // });

    if (isLoading)
        return (
            <div className="max-w-5xl w-screen h-screen flex items-center justify-center mx-auto">
                <Spinner size="xl" />
            </div>
        );

    if (playerMovesData && playerMovesData?.length !== 0)
        return (
            <div className="max-w-5xl w-screen h-screen flex items-center justify-center mx-auto flex-col">
                <h1 className="text-3xl font-semibold text-center">
                    You have already attempted today. Please come again
                    tomorrow.
                </h1>
                <Link
                    href="/guess"
                    className="flex items-center justify-center"
                >
                    <Button className="mt-4" size={"lg"}>
                        Try Guess Some Humans.
                    </Button>
                </Link>
            </div>
        );

    return (
        <div className="container max-w-5xl mx-auto p-6 items-center justify-center grid space-x-6">
            <HowToPlayHuman />
            <GameBoard gameId={id} gameData={gameData} flatBoard={flatBoard} />
        </div>
    );
}
