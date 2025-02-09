import React from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HackbotEmbed() {
    const lastUpdated = "2025-02-09"; // Using actual last updated date
    return (
        <Card className="group w-full max-w-sm overflow-hidden">
            <a
                href="https://hackbot.co/dashboard/lead-keep-great-back"
                className="relative flex items-center gap-4 bg-black p-4 transition-colors hover:bg-zinc-900"
            >
                <div className="absolute right-2 top-2 flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Security</span>
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                </div>
                <div className="shrink-0">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GatlingX-7Scm6O8GikG5Hhv2sYfc5u0TC7vwxI.png"
                        alt="Hackbot Logo"
                        className="h-12 w-12"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-zinc-400">
                        View Report on
                    </span>
                    <span className="text-lg font-semibold text-white">
                        Hackbot Dashboard
                    </span>
                </div>
                <ArrowRight className="ml-auto h-6 w-6 text-zinc-400 transition-transform group-hover:translate-x-1" />
                <div className="absolute bottom-1 left-2 text-[10px] text-zinc-700">
                    last updated: {lastUpdated}
                </div>
            </a>
        </Card>
    );
}
