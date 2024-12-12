import {useGameStore, useWebSocketStore} from "../stores/stores.ts";
import {WEBSOCKET_URL} from "../common/global-constants.ts";
import {IGame, IMessage} from "../common/models.ts";
import {NavigateFunction} from "react-router-dom";

export const useWebSocket = () => {
    const {ws, setWs} = useWebSocketStore();
    const {setPlayer, setGame, setCanMove, setGameStatus, setWinningMsg} = useGameStore();
    // stupid solution, but works, player state does not update in onmessage function
    let localPlayer: "o" | "x" | undefined = undefined;

    const connect = (navigate: NavigateFunction) => {

        // check whether connection is already established
        if (ws) {
            return;
        }

        console.log("ws undefined LOL");
        const webSocket = new WebSocket(WEBSOCKET_URL);
        setWs(webSocket);

        webSocket.onopen = () => {
            console.log("do i send this?")
            webSocket.send(JSON.stringify({type: "JOIN"}));
        }

        webSocket.onmessage = (e: MessageEvent) => {
            const msg = JSON.parse(e.data) as IMessage;
            switch (msg.type) {
                case "JOIN":
                    setPlayer(msg.msg as "o" | "x");
                    setGameStatus("WAIT");
                    localPlayer = msg.msg as "o" | "x";
                    setGame(msg.game as IGame);

                    navigate("/game");
                    break;
                case "START":
                    console.log("IM AT START");
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
                case "WIN":
                case "LOSS":
                case "DRAW":
                    setCanMove(false);
                    setGameStatus(msg.type);
                    setWinningMsg(msg.msg);
                    break;
                default: // error handling
                    console.error(msg.msg);
                    break;
            }
        }

        webSocket.onclose = () => {
            setWs(undefined);
            navigate("/");
        }
    }

    const send = (msg: IMessage) => {
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