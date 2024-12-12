import {IGame} from "./common/models";

/**
 * @returns player who won the game if someone won the game, null when nobody has won the game
 */
export const findGameWinner = (game: IGame): string | null => {
    const board = game.board;

    // horizontal
    if (board[0] !== "" && board[0] === board[1] && board[0] === board[2]) {
        return board[0];
    }
    if (board[3] !== "" && board[3] === board[4] && board[3] === board[5]) {
        return board[3];
    }
    if (board[6] !== "" && board[6] === board[7] && board[6] === board[8]) {
        return board[6];
    }

    // vertical
    if (board[0] !== "" && board[0] === board[3] && board[0] === board[6]) {
        return board[0];
    }
    if (board[1] !== "" && board[1] === board[4] && board[1] === board[7]) {
        return board[1];
    }
    if (board[2] !== "" && board[2] === board[5] && board[2] === board[8]) {
        return board[2];
    }

    // diagonal
    if (board[0] !== "" && board[0] === board[4] && board[0] === board[8]) {
        return board[0];
    }
    if (board[2] !== "" && board[2] === board[4] && board[2] === board[6]) {
        return board[2];
    }

    // draw ?
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            return null; // not a draw, not a win
        }
    }
    return "DRAW";
}

/*console.log(findGameWinner({
    board: ["", "", "", "", "", "", "", "", ""],
    nextMoveBy: "x"
}));*/