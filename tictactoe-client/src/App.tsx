import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import NavigationBar from "./components/NavigationBar.tsx";
import HomePage from "./pages/HomePage.tsx";
import {HashRouter, Route, Routes} from "react-router-dom";
import GamePage from "./pages/GamePage.tsx";


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App = () => {

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <NavigationBar/>
            <main>
                <HashRouter>
                    <Routes>
                        <Route path={"/"} element={<HomePage/>}/>
                        <Route path={"/game"} element={<GamePage/>}/>
                    </Routes>
                </HashRouter>
            </main>
        </ThemeProvider>
    );
}

export default App;
