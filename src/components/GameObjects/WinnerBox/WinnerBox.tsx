import { Box } from '@mui/material';
import { OpponentName, Player } from '../../../utils/Types';
import PillButton from '../../Buttons/PillButton';
import { winnerBoxRootStyles } from './WinnerBox.styles';

interface WinnerBoxProps {
  currentPlayer: Player;
  opponentName: OpponentName;
}

export default function WinnerBox(props: WinnerBoxProps) {
  return (
    <Box className='winner-box' sx={winnerBoxRootStyles}>
      <p className='playerText'>{props.currentPlayer === 'main' ? 'Player 1' : props.opponentName}</p>
      <p className='result'>Wins</p>
      <PillButton>Play Again</PillButton>
    </Box>
  );
}
