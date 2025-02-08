import GuessingPage from "@/components/guess";

export default function Home() {
    return (
        <GuessingPage
            gameId={1}
            player="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
            // player="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        />
    );
}
