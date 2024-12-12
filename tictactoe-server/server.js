"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const game_1 = require("./game");
const wss = new ws_1.WebSocketServer({ port: 9999 });
console.log("WebSocketServer running on port 9999");
wss.on('connection', (ws) => {
    console.log("Client connected");
    ws.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        switch (msg.type) {
            case "JOIN":
                (0, game_1.onJoinGame)(ws);
                break;
            case "MOVE":
                (0, game_1.onMakeAMove)(ws, msg);
                break;
        }
    });
    ws.on("close", () => {
        console.log("ws closed");
    });
});
