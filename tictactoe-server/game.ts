import {
    IGame,
    IPlayer,
    TClientMoveMessage,
    TPlayerName,
    TPotentialWinner,
    TServerMessage
} from "./common/models";
import {WebSocket} from "ws";

const queue: IPlayer[] = [];
const games: IGame[] = [];

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

export const broadcastMessage = (players: IPlayer[], msg: TServerMessage) => {
    players.forEach(x => sendWebSocketMessage(x.socket, msg));
}

export const onJoinGame = (ws: WebSocket) => {
    console.log("RUN");
    let playerName: TPlayerName = queue.length === 0 ? "x" : "o";
    let game: IGame = queue.length === 0 ? {
        board: ["", "", "", "", "", "", "", "", ""],
        nextMoveBy: "x",
        startTime: new Date(),
        players: [],
        id: games.length,
    } : games[games.length - 1];
    let player: IPlayer = {name: playerName, socket: ws};

    console.log(playerName, game, player);

    game.players.push(player);

    if (queue.length === 0) {
        console.log("PUSHED GAME");
        games.push(game);
    }

    queue.push({name: playerName, socket: ws});

    sendWebSocketMessage(ws, {
        type: "JOIN",
        player: playerName,
        game: game
    });

    // 2 players --> send start message
    if (queue.length === 2) {
        game.startTime = new Date();
        broadcastMessage(game.players, {type: "START", game: game});
        queue.pop();
        queue.pop();
        console.log("GAME STARTED LOL");
    }
}

export const onMakeAMove = (ws: WebSocket, msg: TClientMoveMessage) => {
    let game = games.find(x => x.id === msg.game.id);
    console.log("MOVE");
    console.log(game);
    // check if it's player's turn
    if (game && msg.player === game.nextMoveBy) {
        game.board = msg.game.board;
        game.nextMoveBy = game.players.find(x => x.name !== msg.player)!.name;

        // send move message to clients
        broadcastMessage(game.players, {type: "MOVE", game: game});

        // did anyone win the game??
        const winner = findGameWinner(game);
        if (winner !== null) {
            onGameOver(game, winner);
        }
    } else {
        sendWebSocketMessage(ws, {type: "ERROR", msg: "Wait a moment...It is not your turn."});
    }
}

export const onGameOver = (game: IGame, winner: TPotentialWinner) => {
    if (winner === "DRAW") {
        broadcastMessage(game.players, {
            type: "GAMEOVER",
            status: "DRAW",
            msg: "This game ended in a draw."
        });
    } else {
        game.players.forEach(x => sendWebSocketMessage(x.socket, x.name === winner ? {
            type: "GAMEOVER",
            status: "WIN",
            msg: "Winner winner chicken dinner"
        } : {
            type: "GAMEOVER",
            status: "LOSS",
            msg: "Loser hahaha! It's so joever for you!!"
        }));
    }
    const index = games.indexOf(game);
    console.log(index);
}