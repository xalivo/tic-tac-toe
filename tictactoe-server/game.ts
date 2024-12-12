import {
    IGame,
    IPlayer,
    TClientMoveMessage,
    TPlayerName,
    TPotentialWinner,
    TServerMessage
} from "./common/models";
import {WebSocket} from "ws";

const players: IPlayer[] = [];
let game: IGame = {
    board: ["", "", "", "", "", "", "", "", ""],
    nextMoveBy: "x",
    startTime: new Date(),
};

/**
 * @returns player who won the game if someone won the game, null when nobody has won the game
 */
export const findGameWinner = (game: IGame): TPotentialWinner => {
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

export const sendWebSocketMessage = (ws: WebSocket, msg: TServerMessage) => {
    ws.send(JSON.stringify(msg));
}

export const broadcastMessage = (msg: TServerMessage) => {
    players.forEach(x => sendWebSocketMessage(x.socket, msg));
}

export const onJoinGame = (ws: WebSocket) => {
    // check whether there are free player spots
    if (players.length < 2) {
        let player: TPlayerName = players.length === 0 ? "x" : "o";

        players.push({name: player, socket: ws});
        sendWebSocketMessage(ws, {
            type: "JOIN",
            player: player,
            game: game
        });

        // 2 players --> send start message
        if (players.length === 2) {
            game.startTime = new Date();
            broadcastMessage({type: "START", game: game});
        }
    } else {
        sendWebSocketMessage(ws, {
            type: "ERROR",
            msg: "You're too late, all player spots are taken."
        });
    }
}

export const onMakeAMove = (ws: WebSocket, msg: TClientMoveMessage) => {
    // check if it's player's turn
    if (msg.player === game.nextMoveBy) {
        game.board = msg.game.board;
        game.nextMoveBy = players.find(x => x.name !== msg.player)!.name;

        // send move message to clients
        broadcastMessage({type: "MOVE", game: game});

        // did anyone win the game??
        const winner = findGameWinner(game);
        if (winner !== null) {
            onGameOver(winner);
        }
    } else {
        sendWebSocketMessage(ws, {type: "ERROR", msg: "Wait a moment...It is not your turn."});
    }
}

export const onGameOver = (winner: TPotentialWinner) => {
    if (winner === "DRAW") {
        broadcastMessage({
            type: "GAMEOVER",
            status: "DRAW",
            msg: "This game ended in a draw."
        });
    } else {
        players.forEach(x => sendWebSocketMessage(x.socket, x.name === winner ? {
            type: "GAMEOVER",
            status: "WIN",
            msg: "Winner winner chicken dinner"
        } : {
            type: "GAMEOVER",
            status: "LOSS",
            msg: "Loser hahaha! It's so joever for you!!"
        }));
    }

    // remove all players
    players.pop();
    players.pop();
    // reset game
    game = {
        board: ["", "", "", "", "", "", "", "", ""],
        nextMoveBy: "x",
        startTime: new Date()
    }
}