import { Box } from '@mui/material';
import PillButton from '../Buttons/PillButton';
import ConnectFourGridBlack from '../GameObjects/ConnectFourGridBlack';
import ConnectFourGridWhite from '../GameObjects/ConnectFourGridWhite';
import ScoreBox from '../GameObjects/ScoreBox';
import PlayerOne from '../Icons/PlayerOne';
import PlayerTwo from '../Icons/PlayerTwo';
import Logo from '../Logo/Logo';
import { gameBoardContainerStyles } from './GameBoard.styles';

export default function GameBoard() {
  return (
    <Box sx={gameBoardContainerStyles}>
      <ScoreBox Icon={<PlayerOne />} playerText='Player 1' />
      <div className='group'>
        <header>
          <PillButton>Menu</PillButton>
          <Logo />
          <PillButton>Restart</PillButton>
        </header>
        <div className='scores'>
          <ScoreBox Icon={<PlayerOne />} iconPlacement='left' playerText='Player 1' />
          <ScoreBox Icon={<PlayerTwo />} iconPlacement='right' playerText='Player 2' />
        </div>
        <div className='board'>
          <div className='grid'>
            <ConnectFourGridWhite />
            {/* <Box sx={{ backgroundColor: 'red' }}>dsfssdjf;sd jf; sd flsd f;jd ddf</Box> */}
            <ConnectFourGridBlack />
          </div>
        </div>
      </div>
      <ScoreBox Icon={<PlayerTwo />} playerText='Player 2' />
    </Box>
  );
}
