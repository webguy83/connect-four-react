import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PlayerVsPlayerIcon from '../Icons/PlayerVsPlayerIcon';
import PlayerVsCpuIcon from '../Icons/PlayerVsCpuIcon';
import Logo from '../Logo/Logo';
import { MainMenuContainerStyle } from './MainMenu.styles';
import MenuButton from '../Buttons/MenuButton';
import { Fade, GlobalStyles } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { GameState } from '../../utils/Types';

interface MainMenuProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
}

const menuGlobalStyles = <GlobalStyles styles={(theme) => ({ body: { backgroundColor: theme.palette.primary.main } })} />;

export default function MainMenu(props: MainMenuProps) {
  function onGameRulesClicked() {
    props.setGameState('rules');
  }

  return (
    <>
      {menuGlobalStyles}
      <Fade in={true}>
        <Box maxWidth={480} display='flex' flexDirection='column' alignItems='center' sx={MainMenuContainerStyle} borderRadius={10}>
          <Box mb={7.5}>
            <Logo />
          </Box>
          <Stack spacing={3}>
            <MenuButton sx={(theme) => ({ backgroundColor: theme.palette.secondary.dark, '&:hover': { backgroundColor: theme.palette.secondary.dark } })} variant='contained' endIcon={<PlayerVsCpuIcon />}>
              <Box component='span'>Play vs CPU</Box>
            </MenuButton>
            <MenuButton sx={(theme) => ({ backgroundColor: theme.palette.secondary.main, '&:hover': { backgroundColor: theme.palette.secondary.main }, color: theme.palette.primary.dark })} variant='contained' endIcon={<PlayerVsPlayerIcon />}>
              <Box component='span' sx={{ mr: 10 }}>
                Play vs Player
              </Box>
            </MenuButton>
            <MenuButton onClick={onGameRulesClicked} sx={(theme) => ({ backgroundColor: theme.palette.secondary.light, '&:hover': { backgroundColor: theme.palette.secondary.light }, color: theme.palette.primary.dark })} variant='contained'>
              <Box component='span'>Game Rules</Box>
            </MenuButton>
          </Stack>
        </Box>
      </Fade>
    </>
  );
}
