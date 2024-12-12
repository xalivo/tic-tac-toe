import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

interface IGameOverDialogProps {
    gameStatus?: string;
    msg: string;
    quitFunction: () => void;
    playAgainFunction: () => void;
}

const GameOverDialog = ({gameStatus, msg, quitFunction, playAgainFunction}: IGameOverDialogProps) => {
    return (
        <Dialog
            open={gameStatus !== undefined && gameStatus !== "WAIT"}
            keepMounted
        >
            <DialogTitle>{gameStatus} !!!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {msg}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={quitFunction}>Quit</Button>
                <Button onClick={playAgainFunction}>Play Again</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GameOverDialog;