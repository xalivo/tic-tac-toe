import GameBoard from "../components/GameBoard.tsx";
import {Button, Container, Divider, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useWebSocket} from "../hooks/useWebSocket.ts";
import {useErrorStore} from "../stores/stores.ts";

const HomePage = () => {
    const navigate = useNavigate();
    const {connect} = useWebSocket();
    const {error} = useErrorStore();

    return (
        <Container sx={{paddingTop: 10}}>
            <Stack alignItems={"center"} spacing={3}>
                <Typography variant={"h1"} component={"p"}>Tic Tac Toe</Typography>
                <Typography component={"p"}>Do you want to play a game of TicTacToe? Join a game by pressing the button below.</Typography>
                <Button variant={"contained"} type={"button"} onClick={() => connect(navigate)}>Join a game!</Button>
                {error && <Typography component={"p"}>{error}</Typography>}
                <Divider orientation={"horizontal"} flexItem/>
                <GameBoard/>
            </Stack>
        </Container>
    );
};

export default HomePage;