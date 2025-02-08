"use client";

import { ShoppingBasket, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex items-center p-3 px-5 text-sm">
                <div className="flex items-center justify-between w-full">
                    {/* Left Section */}
                    <div className="flex items-center gap-5">
                        <ThemeToggle />
                        <Link
                            href={"/"}
                            className="flex items-center hover:bg-accent hover:text-accent-foreground p-2 rounded"
                        >
                            <ShoppingBasket className="stroke-primary" />
                            <span className="ml-2 text-primary hidden sm:block">
                                GuessTheHuman
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex gap-4 items-center">
                        <Link href={"/game"}>
                            <Button>Go To Game</Button>
                        </Link>
                        {/* @ts-expect-error msg */}
                        <appkit-button />
                    </div>
                </div>
            </div>
            <div className="flex md:hidden p-4 gap-x-2">
                {/* @ts-expect-error msg */}
                <appkit-button />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Open Menu"
                        >
                            <Menu />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                            <Link href={"/game"}>
                                <Button>Go To Game</Button>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};

export default Navbar;
