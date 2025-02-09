import * as React from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
export function HowToPlayHuman() {
    const [open, setOpen] = React.useState(true);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        How to Play as Human <br />
                        <span className="text-xl font-normal text-ring">
                            Blend In
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-ring py-4 pl-4">
                        <ul className="list-disc list-outside space-y-2 text-left text-lg">
                            <li>
                                Collect the Yellow Points 🟡 while avoiding Red
                                Points 🔴 to increase your score.
                            </li>
                            <li>
                                Yellows 🟡 award 10 points whereas Reds 🔴
                                penalise 5 points.
                            </li>
                            <li>
                                Blend in with the AI to avoid being caught by
                                the <strong>Guessers</strong>.
                            </li>
                            <li>
                                The AI collect Yellows 🟡 while being blind to
                                Reds 🔴.
                            </li>
                        </ul>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export function HowToPlayGuesser() {
    const [open, setOpen] = React.useState(true);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        How to Play as Guesser <br />
                        <span className="text-xl font-normal text-ring">
                            Find the Humans
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-ring py-4">
                        <ul className="list-disc list-outside space-y-2 text-left text-lg pl-4">
                            <li>Distinguish between the AI and the human.</li>
                            <li>
                                The AI cannot see the Reds 🔴 unlikethe humans
                                can and will be penalised when they collect, use
                                this to tell the two apart and identify the
                                human.
                            </li>
                            <li>
                                You steal the <strong>Human&apos;s</strong>{" "}
                                score if you guess correctly.
                            </li>
                        </ul>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
