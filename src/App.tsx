import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard/GameBoard';
import MainMenu from './components/MainMenu/MainMenu';
import Rules from './components/Rules/Rules';
import themeOptions from './CustomTheme';
import { GameState } from './utils/Types';

const theme = createTheme(themeOptions);

function App() {
  const [gameState, setGameState] = useState<GameState>('game-board');
  return (
    <div className='app'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {gameState === 'main-menu' && <MainMenu setGameState={setGameState} />}
        {gameState === 'rules' && <Rules setGameState={setGameState} />}
        {gameState === 'game-board' && <GameBoard />}
      </ThemeProvider>
    </div>
  );
}

export default App;
