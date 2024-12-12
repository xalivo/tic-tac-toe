import CloseIcon from '@mui/icons-material/Close';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import {Grid2 as Grid} from "@mui/material";
import {useGameStore} from "../stores/stores.ts";
import {useWebSocket} from "../hooks/useWebSocket.ts";

const GameBoard = () => {
    const {game, player, canMove, setCanMove} = useGameStore();
    const {send} = useWebSocket();

    const handleOnClickOnBoard = (index: number) => {
        if ((canMove && player) && game.board[index] === "") {
            const updatedBoard = game.board;
            updatedBoard[index] = player;
            setCanMove(false);
            send({type: "MOVE", game: {...game, board: updatedBoard}, player: player});
        }
    }

    return (
        <Grid width={368} container spacing={0.5} bgcolor={"white"}>
            {game.board.map((x, index) =>
                <Grid key={index} size={4} sx={{
                    position: "relative",
                    width: 120,
                    "&::before": {
                        display: "block",
                        content: "''",
                        paddingBottom: "100%",
                    }
                }}>
                    <Grid container
                          onClick={() => handleOnClickOnBoard(index)}
                          style={{
                              position: "absolute",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "#121212",
                          }}
                    >
                        {x === "x" ? <CloseIcon sx={{fontSize: 80}}/> : x === "o" ?
                            <PanoramaFishEyeIcon sx={{fontSize: 80}}/> : ""}
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default GameBoard;