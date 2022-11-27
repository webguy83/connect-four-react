import { Box } from '@mui/material';
import PillButton from '../../Buttons/PillButton';
import { winnerBoxRootStyles } from './WinnerBox.styles';

export default function WinnerBox() {
  return (
    <Box className='winner-box' sx={winnerBoxRootStyles}>
      <p className='playerText'>Player 1</p>
      <p className='result'>Wins</p>
      <PillButton>Play Again</PillButton>
    </Box>
  );
}
