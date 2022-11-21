import { Box } from '@mui/material';
import PillButton from '../Buttons/PillButton';
import ConnectFourGridBlack from '../GameObjects/ConnectFourGridBlack';
import ConnectFourGridWhite from '../GameObjects/ConnectFourGridWhite';
import ScoreBox from '../GameObjects/ScoreBox';
import Logo from '../Logo/Logo';
import { gameBoardContainerStyles } from './GameBoard.styles';

export default function GameBoard() {
  return (
    <Box sx={gameBoardContainerStyles}>
      <header>
        <PillButton>Menu</PillButton>
        <Logo />
        <PillButton>Restart</PillButton>
      </header>
      <main>
        <div className='board'>
          <ScoreBox />
          <div className='grid'>
            <ConnectFourGridWhite />
            <ConnectFourGridBlack />
          </div>

          <ScoreBox />
        </div>
      </main>
    </Box>
  );
}
