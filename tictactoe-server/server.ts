import {WebSocketServer, WebSocket} from "ws";
import {IClientMessage, IGame, IPlayer} from "./common/models";
import {findGameWinner} from "./game";

const wss = new WebSocketServer({port: 9999});
const players: IPlayer[] = [];
let game: IGame = {
    board: ["", "", "", "", "", "", "", "", ""],
    nextMoveBy: "x"
};

console.log("WebSocketServer running on port 9999");

wss.on('connection', (ws: WebSocket) => {
    console.log("Client connected");

    ws.on('message', (data) => {
        const msg = JSON.parse(data.toString()) as IClientMessage;
        console.log(msg);
        switch (msg.type) {
            case "JOIN":
                if (players.length === 0) {
                    players.push({name: "x", socket: ws});
                    ws.send(JSON.stringify({
                        type: "JOIN",
                        msg: "x",
                        game: game
                    }));
                } else if (players.length === 1) {
                    players.push({name: "o", socket: ws});
                    ws.send(JSON.stringify({
                        type: "JOIN",
                        msg: "o",
                        game: game
                    }));
                } else {
                    ws.send(JSON.stringify({
                        type: "ERROR",
                        msg: "You're too late, all player spots are taken."
                    }));
                }
                // 2 players --> send start message
                if (players.length === 2) {
                    players.forEach(x => x.socket.send(JSON.stringify({type: "START", msg: "", game: game})));
                }
                break;
            case "MOVE":
                if (players.length === 2) {
                    // check if it is this player's turn to move
                    if (msg.player === game.nextMoveBy) {
                        console.log("MOVE BY ", msg.player);
                        if (msg.game) {
                            game.board = msg.game.board;
                            game.nextMoveBy = players.find(x => x.name !== msg.player)!.name;
                            console.log("NEXT MOVE BY ", game.nextMoveBy);

                            // send move message to clients
                            players.forEach(x => x.socket.send(JSON.stringify({type: "MOVE", msg: "", game: game})));
                            console.log("SENT MOVE MESSAGE ", game);

                            // did anyone win the game??
                            const winner = findGameWinner(game);
                            if (winner !== null) {
                                console.log("FOUND A WINNER ", winner);
                                if (winner === "DRAW") {
                                    players.forEach(x => x.socket.send(JSON.stringify({
                                        type: "DRAW",
                                        msg: "This game ended in a draw.",
                                        game: game
                                    })));
                                } else {
                                    players.forEach(x => x.name === winner ? x.socket.send(JSON.stringify({
                                        type: "WIN",
                                        msg: "Winner winner chicken dinner",
                                        game: game
                                    })) : x.socket.send(JSON.stringify({type: "LOSS", msg: "Loser hahaha! It's so joever for you!!", game: game})));

                                }
                                console.log("ENDED GAME");
                                // remove all players
                                players.pop();
                                players.pop();
                                // reset game
                                game = {
                                    board: ["", "", "", "", "", "", "", "", ""],
                                    nextMoveBy: "x"
                                }
                            }
                        }
                    } else {
                        ws.send(JSON.stringify({type: "ERROR", msg: "Wait a moment...It is not your turn.", game: null}));
                    }
                }
                break;
        }
    });

    ws.on("close", () => {
        console.log("ws closed");
    })
});