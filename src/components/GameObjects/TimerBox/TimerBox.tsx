import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { mainColour } from '../../../CustomTheme';
import { mainTransition } from '../../../utils/Styles';
import TimerIcon from '../../Icons/TimerIcon';
import { timerBoxRootStyles } from './TimerBox.styles';

interface TimerBoxProps {
  playerColour: string;
}

export default forwardRef((props: TimerBoxProps, ref) => {
  return (
    <Box ref={ref} style={{ color: props.playerColour }} sx={timerBoxRootStyles}>
      <div className='info' style={{ color: props.playerColour === mainColour.main ? mainColour.light : mainColour.dark, transition: `all ${mainTransition}` }}>
        <p className='playerText'>Player 1's Turn</p>
        <p className='timer'>14s</p>
      </div>
      <TimerIcon />
    </Box>
  );
});
