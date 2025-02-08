import GameBoard from "@/components/gameboard";

export default function Game() {
    return (
        <div className="container max-w-5xl mx-auto p-6 items-center justify-center grid xl:grid-cols-2">
            <GameBoard gameId={1} />
        </div>
    );
}
