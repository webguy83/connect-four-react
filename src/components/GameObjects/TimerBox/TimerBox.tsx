import { Box } from '@mui/material';
import TimerIcon from '../../Icons/TimerIcon';
import { timerBoxRootStyles } from './TimerBox.styles';

export default function TimerBox() {
  return (
    <Box sx={timerBoxRootStyles}>
      <div className='info'>
        <p className='playerText'>Player 1's Turn</p>
        <p className='timer'>14s</p>
      </div>
      <TimerIcon />
    </Box>
  );
}
