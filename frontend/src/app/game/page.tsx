import GameBoard from "@/components/gameboard";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function Game() {
    return (
        <div className="container max-w-5xl mx-auto p-6 items-center justify-center grid xl:grid-cols-2 space-x-6">
            <GameBoard gameId={1} />
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
