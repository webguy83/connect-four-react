import { Box, Stack, Typography } from '@mui/material';
import RectangleButton from '../Buttons/RectangleButton';
import { pauseMenuStyles } from './PauseMenu.styles';

export default function PauseMenu() {
  return (
    <Box sx={pauseMenuStyles}>
      <Typography variant='h2'>Pause</Typography>
      <Stack spacing={3}>
        <RectangleButton className='continue-game-btn' variant='contained'>
          <Box component='span'>Continue Game</Box>
        </RectangleButton>
        <RectangleButton className='restart-game-btn' variant='contained'>
          <Box component='span' className='text'>
            Restart
          </Box>
        </RectangleButton>
        <RectangleButton className='quit-game-btn' variant='contained'>
          <Box component='span'>Quit Game</Box>
        </RectangleButton>
      </Stack>
    </Box>
  );
}
