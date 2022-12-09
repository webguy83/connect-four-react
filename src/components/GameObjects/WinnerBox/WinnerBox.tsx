import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { OpponentName, Player } from '../../../utils/Types';
import PillButton from '../../Buttons/PillButton';
import { winnerBoxRootStyles } from './WinnerBox.styles';

interface WinnerBoxProps {
  currentPlayer: Player;
  opponentName: OpponentName;
  onPlayAgainClick: () => void;
}

export default forwardRef((props: WinnerBoxProps, ref) => {
  return (
    <Box ref={ref} className='winner-box' onClick={props.onPlayAgainClick} sx={winnerBoxRootStyles}>
      <p className='playerText'>{props.currentPlayer === 'main' ? 'Player 1' : props.opponentName}</p>
      <p className='result'>Wins</p>
      <PillButton>Play Again</PillButton>
    </Box>
  );
});
