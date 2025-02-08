"use client";
import GameBoard from "@/components/gameboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
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

    if (isLoading)
        return (
            <div className="max-w-5xl w-screen h-screen flex items-center justify-center mx-auto">
                <Spinner size="xl" />
            </div>
        );

    if (playerMovesData?.length !== 0)
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
        <div className="container max-w-5xl mx-auto p-6 items-center justify-center grid xl:grid-cols-2 space-x-6">
            <GameBoard gameId={id} gameData={gameData} flatBoard={flatBoard} />
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-4/5"
            >
                <CarouselContent className="-mt-1 h-[36rem]">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index} className="pt-1">
                            <div className="p-1 h-full">
                                <Card className="h-full">
                                    <CardContent className="flex items-center justify-center p-6">
                                        <span className="text-3xl font-semibold">
                                            {index + 1}
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
