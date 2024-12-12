import {useGameStore, useWebSocketStore} from "../stores/stores.ts";
import {WEBSOCKET_URL} from "../common/global-constants.ts";
import {TClientMessage, TPlayerName, TServerMessage} from "../common/models.ts";
import {NavigateFunction} from "react-router-dom";

export const useWebSocket = () => {
    const {ws, setWs} = useWebSocketStore();
    const {setPlayer, setGame, setCanMove, setGameStatus, setWinningMsg} = useGameStore();
    let localPlayer: TPlayerName | undefined = undefined;

    const connect = (navigate: NavigateFunction) => {

        // check whether connection is already established
        if (ws) {
            return;
        }

        const webSocket = new WebSocket(WEBSOCKET_URL);
        setWs(webSocket);

        webSocket.onopen = () => {
            webSocket.send(JSON.stringify({type: "JOIN"}));
        }

        webSocket.onmessage = (e: MessageEvent) => {
            const msg = JSON.parse(e.data) as TServerMessage;
            switch (msg.type) {
                case "JOIN":
                    setPlayer(msg.player);
                    localPlayer = msg.player;
                    setGameStatus("WAIT");
                    setGame(msg.game);

                    navigate("/game");
                    break;
                case "START":
                    setGameStatus(undefined);
                    if (localPlayer === "x") {
                        setCanMove(true);
                    }
                    break;
                case "MOVE":
                    if (msg.game) {
                        setGame(msg.game);
                        if (msg.game.nextMoveBy === localPlayer) {
                            setCanMove(true);
                        }
                    }
                    break;
                case "GAMEOVER":
                    setCanMove(false);
                    setGameStatus(msg.status);
                    setWinningMsg(msg.msg);
                    break;
                default: // errors
                    console.error(msg.msg);
                    break;
            }
        }

        webSocket.onclose = () => {
            setWs(undefined);
            navigate("/");
        }
    }

    const send = (msg: TClientMessage) => {
        if (ws?.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is NOT connected");
            return;
        }
        ws.send(JSON.stringify(msg));
    }

    const disconnect = () => {
        // check whether there is a connection established
        if (!ws) {
            return;
        }
        ws.close();

        // set to defaults
        setWs(undefined);
        setGameStatus(undefined);
        setPlayer(undefined);
    }

    return {connect, disconnect, send}
}