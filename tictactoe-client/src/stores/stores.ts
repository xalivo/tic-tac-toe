import {IGame} from "../common/models.ts";
import {create} from "zustand";

// default values
const exampleGame: IGame = {
    id: -1,
    board: ["x", "", "o",
        "o", "x", "",
        "x", "o", "x"],
    nextMoveBy: "x",
    startTime: new Date(0),
    players: []
};

// types
type GameStore = {
    game: IGame;
    setGame: (updatedGame: IGame) => void;
    player?: "x" | "o";
    setPlayer: (newPlayer: "x" | "o" | undefined) => void;
    canMove: boolean;
    setCanMove: (state: boolean) => void;
    gameStatus?: string;
    setGameStatus: (status: string | undefined) => void;
    winningMsg: string;
    setWinningMsg: (msg: string) => void;
}

type WebSocketStore = {
    ws?: WebSocket;
    setWs: (newWs: WebSocket | undefined) => void;
}

type ErrorStore = {
    error?: string;
    setError: (newError: string | undefined) => void;
}

// stores
export const useGameStore = create<GameStore>((set) => ({
    game: exampleGame,
    setGame: (updatedGame: IGame) => set({game: updatedGame}),
    setPlayer: (newPlayer: "x" | "o" | undefined) => set({player: newPlayer}),
    canMove: false,
    setCanMove: (state: boolean) => set({canMove: state}),
    setGameStatus: (status: string | undefined) => set({gameStatus: status}),
    winningMsg: "",
    setWinningMsg: (msg: string) => set({winningMsg: msg}),
}));

export const useWebSocketStore = create<WebSocketStore>((set) => ({
    setWs: (newWs: WebSocket | undefined) => set({ws: newWs}),
}));

export const useErrorStore = create<ErrorStore>((set) => ({
    setError: (newError: string | undefined) => set({error: newError}),
}));