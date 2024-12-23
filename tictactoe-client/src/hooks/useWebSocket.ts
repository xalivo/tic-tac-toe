import {useErrorStore, useGameStore, useWebSocketStore} from "../stores/stores.ts";
import {WEBSOCKET_URL} from "../common/global-constants.ts";
import {TClientMessage, TPlayerName, TServerMessage} from "../common/models.ts";
import {NavigateFunction} from "react-router-dom";

export const useWebSocket = () => {
    const {ws, setWs} = useWebSocketStore();
    const {setPlayer, setGame, setCanMove, setGameStatus, setWinningMsg} = useGameStore();
    const {error, setError} = useErrorStore();
    let localPlayer: TPlayerName | undefined = undefined;

    const connect = (navigate: NavigateFunction) => {

        if (ws && error) { // check whether connection is established & error occurred
            disconnect();
            connect(navigate);
        } else if (ws) { // check whether connection is already established
            return;
        }

        const webSocket = new WebSocket(WEBSOCKET_URL);
        setWs(webSocket);

        webSocket.onopen = () => {
            webSocket.send(JSON.stringify({type: "JOIN"}));
        }

        webSocket.onmessage = (e: MessageEvent) => {
            setError(undefined);
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
                    console.log(msg.game);
                    setGame(msg.game);
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
                    setError(msg.msg);
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