import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export enum MOVE {
    L = 0,
    R = 1,
    U = 2,
    D = 3,
}

export function generateAINextMove(
    seed: number,
    position: { row: number; col: number },
    board: number[][]
): MOVE {
    const { row, col } = position;
    // iterate through all possible moves and everytime it hits a border it chosses a different move
    while (true) {
        const nextMove = seed % 4;
        seed++;
        // if move is valid return it
        // else continue to next move
        if (nextMove === MOVE.L && col > 0 && board[row][col - 1] !== 1) {
            return nextMove;
        }
        if (nextMove === MOVE.R && col < 4 && board[row][col + 1] !== 1) {
            return nextMove;
        }
        if (nextMove === MOVE.U && row > 0 && board[row - 1][col] !== 1) {
            return nextMove;
        }
        if (nextMove === MOVE.D && row < 4 && board[row + 1][col] !== 1) {
            return nextMove;
        }
    }
}
