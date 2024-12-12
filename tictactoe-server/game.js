"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onGameOver = exports.onMakeAMove = exports.onJoinGame = exports.broadcastMessage = exports.sendWebSocketMessage = exports.findGameWinner = void 0;
const players = [];
let game = {
    board: ["", "", "", "", "", "", "", "", ""],
    nextMoveBy: "x"
};
/**
 * @returns player who won the game if someone won the game, null when nobody has won the game
 */
const findGameWinner = (game) => {
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
};
exports.findGameWinner = findGameWinner;
const sendWebSocketMessage = (ws, msg) => {
    ws.send(JSON.stringify(msg));
};
exports.sendWebSocketMessage = sendWebSocketMessage;
const broadcastMessage = (msg) => {
    players.forEach(x => (0, exports.sendWebSocketMessage)(x.socket, msg));
};
exports.broadcastMessage = broadcastMessage;
const onJoinGame = (ws) => {
    // check whether there are free player spots
    if (players.length < 2) {
        let player = players.length === 0 ? "x" : "o";
        players.push({ name: player, socket: ws });
        (0, exports.sendWebSocketMessage)(ws, {
            type: "JOIN",
            player: player,
            game: game
        });
        // 2 players --> send start message
        if (players.length === 2) {
            (0, exports.broadcastMessage)({ type: "START" });
        }
    }
    else {
        (0, exports.sendWebSocketMessage)(ws, {
            type: "ERROR",
            msg: "You're too late, all player spots are taken."
        });
    }
};
exports.onJoinGame = onJoinGame;
const onMakeAMove = (ws, msg) => {
    // check if it's player's turn
    if (msg.player === game.nextMoveBy) {
        game.board = msg.game.board;
        game.nextMoveBy = players.find(x => x.name !== msg.player).name;
        // send move message to clients
        (0, exports.broadcastMessage)({ type: "MOVE", game: game });
        // did anyone win the game??
        const winner = (0, exports.findGameWinner)(game);
        if (winner !== null) {
            (0, exports.onGameOver)(winner);
        }
    }
    else {
        (0, exports.sendWebSocketMessage)(ws, { type: "ERROR", msg: "Wait a moment...It is not your turn." });
    }
};
exports.onMakeAMove = onMakeAMove;
const onGameOver = (winner) => {
    if (winner === "DRAW") {
        (0, exports.broadcastMessage)({
            type: "GAMEOVER",
            status: "DRAW",
            msg: "This game ended in a draw."
        });
    }
    else {
        players.forEach(x => (0, exports.sendWebSocketMessage)(x.socket, x.name === winner ? {
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
        nextMoveBy: "x"
    };
};
exports.onGameOver = onGameOver;
