import {AppBar, Toolbar, Typography} from "@mui/material";

const NavigationBar = () => {
    return (
        <AppBar position="static" color={"secondary"}>
            <Toolbar sx={{paddingY: 2}}>
                <Typography variant="h4" component="div">
                    TicTacToe
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;