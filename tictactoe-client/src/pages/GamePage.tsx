import {useGameStore} from "../stores/stores.ts";
import GameBoard from "../components/GameBoard.tsx";
import {
    Container,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import GameOverDialog from "../components/GameOverDialog.tsx";
import {useWebSocket} from "../hooks/useWebSocket.ts";
import {useNavigate} from "react-router-dom";

const GamePage = () => {
    const {disconnect, send} = useWebSocket();
    const {player, game, gameStatus, winningMsg} = useGameStore();
    const navigate = useNavigate();

    const startTime = new Date();
    const [time, setTime] = useState<Date>(new Date(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date(new Date().getTime() - startTime.getTime()));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const onQuit = () => {
        disconnect();
        navigate("/");
    }

    const onPlayAgain = () => {
        send({type: "JOIN"});
        setTime(new Date(0));
    }

    return (
        <Container sx={{paddingTop: 3}}>
            <Stack alignItems={"center"} spacing={3}>
                <Stack width={"100%"} direction={"row"} justifyContent={"space-around"}>
                    <Typography variant={"h6"} component={"p"}>Player: {player}</Typography>
                    <Typography variant={"h6"}
                                component={"p"}>Time: {time.getMinutes()}:{time.getSeconds()}</Typography>
                </Stack>
                <Divider orientation={"horizontal"} flexItem/>
                <Typography variant={"h6"}
                            component={"p"}>{gameStatus === "WAIT" ? "Waiting..." : game.nextMoveBy === player ?
                    "It is your turn to move!" : `Player ${game.nextMoveBy}'s turn`}</Typography>
                <Divider/>
                <GameBoard/>
                <GameOverDialog gameStatus={gameStatus} msg={winningMsg} quitFunction={onQuit}
                                playAgainFunction={onPlayAgain}/>
            </Stack>
        </Container>
    );
};

export default GamePage;