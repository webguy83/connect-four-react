import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PlayerVsPlayerIcon from '../Icons/PlayerVsPlayerIcon';
import Logo from '../Logo/Logo';
import { MainMenuContainerStyle } from './MainMenu.styles';

export default function MainMenu() {
  return (
    <Box maxWidth={480} display='flex' flexDirection='column' alignItems='center' sx={MainMenuContainerStyle} borderRadius={5}>
      <Box mb={7.5}>
        <Logo />
      </Box>
      <Stack spacing={2}>
        <Button sx={{ borderRadius: 2.5, justifyContent: 'space-between' }} variant='contained' endIcon={<PlayerVsPlayerIcon />}>
          <Box component='span'>Play vs CPU</Box>
        </Button>
        <Button sx={{ borderRadius: 2.5, justifyContent: 'space-between' }} variant='contained' endIcon={<PlayerVsPlayerIcon />}>
          <Box component='span'>Play vs Player</Box>
        </Button>
        <div>div 2</div>
      </Stack>
    </Box>
  );
}
