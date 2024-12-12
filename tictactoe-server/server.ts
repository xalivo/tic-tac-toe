import {WebSocketServer, WebSocket} from "ws";
import {TClientMessage} from "./common/models";
import {onJoinGame, onMakeAMove} from "./game";

const wss = new WebSocketServer({port: 9999});

console.log("WebSocketServer running on port 9999");

wss.on('connection', (ws: WebSocket) => {
    console.log("Client connected");

    ws.on('message', (data) => {
        const msg = JSON.parse(data.toString()) as TClientMessage;

        switch (msg.type) {
            case "JOIN":
                onJoinGame(ws);
                break;
            case "MOVE":
                onMakeAMove(ws, msg);
                break;
        }
    });

    ws.on("close", () => {
        console.log("ws closed");
    })
});