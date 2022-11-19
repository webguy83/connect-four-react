import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PlayerVsPlayerIcon from '../Icons/PlayerVsPlayerIcon';
import PlayerVsCpuIcon from '../Icons/PlayerVsCpuIcon';
import Logo from '../Logo/Logo';
import { MainMenuContainerStyle } from './MainMenu.styles';

export default function MainMenu() {
  return (
    <Box maxWidth={480} display='flex' flexDirection='column' alignItems='center' sx={MainMenuContainerStyle} borderRadius={10}>
      <Box mb={7.5}>
        <Logo />
      </Box>
      <Stack spacing={2}>
        <Button sx={{ borderRadius: 5, justifyContent: 'space-between', py: 1.625, backgroundColor: (theme) => theme.palette.secondary.dark }} variant='contained' endIcon={<PlayerVsCpuIcon />}>
          <Box component='span'>Play vs CPU</Box>
        </Button>
        <Button sx={{ borderRadius: 5, justifyContent: 'space-between', py: 1.625 }} color='secondary' variant='contained' endIcon={<PlayerVsPlayerIcon />}>
          <Box component='span' sx={{ mr: 10 }}>
            Play vs Player
          </Box>
        </Button>
        <Button sx={{ borderRadius: 5, justifyContent: 'space-between', py: 1.625, backgroundColor: (theme) => theme.palette.secondary.light, color: (theme) => theme.palette.primary.dark }} variant='contained'>
          <Box component='span'>Game Rules</Box>
        </Button>
      </Stack>
    </Box>
  );
}
