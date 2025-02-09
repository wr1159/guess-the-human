import HackbotEmbed from "@/components/hackbot-embed";
import Leaderboard from "@/components/leaderboard";

export default function Home() {
    return (
        <div className="max-w-5xl mx-auto p-6 items-center justify-center grid space-x-6 w-screen">
            <Leaderboard />
            <HackbotEmbed />
        </div>
    );
}
