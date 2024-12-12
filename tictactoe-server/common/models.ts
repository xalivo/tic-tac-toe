import {WebSocket} from "ws";

export interface IPlayer {
    name: "x" | "o";
    socket: WebSocket;
}

export interface IGame {
    board: string[];
    nextMoveBy: "x" | "o";
}

export interface IMessage {
    type: string;
    msg: string;
    game: IGame | undefined;
}

export interface IClientMessage extends IMessage {
    player: "x" | "o";
}