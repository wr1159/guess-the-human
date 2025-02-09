import HackbotEmbed from "@/components/hackbot-embed";
import Leaderboard from "@/components/leaderboard";
import { BackgroundPaths } from "@/components/ui/background-paths";

export default function Home() {
    return (
        <div className="mx-auto items-center justify-center w-screen">
            <BackgroundPaths title="GuessTheHuman" />
            <div className="max-w-5xl mx-auto justify-center items-center mt-10">
                <div className="border rounded-lg p-2 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-center py-2">
                        Weekly Leaderboard
                    </h2>
                    <Leaderboard />
                </div>

                <div className="border rounded-lg p-2 flex flex-col items-center mt-10 mb-10">
                    <h2 className="text-3xl font-bold text-center py-2">
                        Secured By GatlingX
                    </h2>
                    <HackbotEmbed />
                </div>
            </div>
        </div>
    );
}
