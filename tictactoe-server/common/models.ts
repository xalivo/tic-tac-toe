import {WebSocket} from "ws";

export type TPlayerName = "x" | "o";
export type TBoardFieldContent = TPlayerName | "";
export type TPotentialWinner = TPlayerName | "DRAW" | null;

export interface IPlayer {
    name: TPlayerName;
    socket: WebSocket;
}

export interface IGame {
    id: number;
    board: TBoardFieldContent[];
    nextMoveBy: "x" | "o";
    startTime: Date;
    players: IPlayer[];
}

export type TClientJoinMessage = {
    type: "JOIN";
}

export type TClientMoveMessage = {
    type: "MOVE";
    game: IGame;
    player: TPlayerName;
}

export type TServerJoinMessage = {
    type: "JOIN";
    player: TPlayerName;
    game: IGame;
}

export type TServerStartMessage = {
    type: "START";
    game: IGame;
}

export type TServerErrorMessage = {
    type: "ERROR";
    msg: string;
}

export type TServerMoveMessage = {
    type: "MOVE";
    game: IGame;
}

export type TServerGameOverMessage = {
    type: "GAMEOVER";
    status: "WIN" | "LOSS" | "DRAW";
    msg: string;
}

export type TClientMessage = TClientJoinMessage | TClientMoveMessage;
export type TServerMessage = TServerJoinMessage | TServerStartMessage | TServerErrorMessage | TServerMoveMessage | TServerGameOverMessage;