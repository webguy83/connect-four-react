import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import PlayerVsPlayerIcon from '../Icons/PlayerVsPlayerIcon';
import PlayerVsCpuIcon from '../Icons/PlayerVsCpuIcon';
import Logo from '../Logo/Logo';
import { MainMenuContainerStyle } from './MainMenu.styles';
import RectangleButton from '../Buttons/RectangleButton';
import { Fade, GlobalStyles } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { GameState } from '../../utils/Types';

interface MainMenuProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
}

export default function MainMenu(props: MainMenuProps) {
  const menuGlobalStyles = (
    <GlobalStyles
      styles={(theme) => ({
        body: {
          backgroundColor: theme.palette.primary.light,
          [theme.breakpoints.up('sm')]: {
            backgroundColor: theme.palette.primary.main,
          },
        },
      })}
    />
  );

  function onGameRulesClicked() {
    props.setGameState('rules');
  }

  function onGameBoardClicked() {
    props.setGameState('game-board');
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
            <RectangleButton className='playVsCpu' variant='contained' endIcon={<PlayerVsCpuIcon />}>
              <Box component='span'>Play vs CPU</Box>
            </RectangleButton>
            <RectangleButton className='playVsPlayer' onClick={onGameBoardClicked} variant='contained' endIcon={<PlayerVsPlayerIcon />}>
              <Box component='span' className='text'>
                Play vs Player
              </Box>
            </RectangleButton>
            <RectangleButton className='gameRules' onClick={onGameRulesClicked} variant='contained'>
              <Box component='span'>Game Rules</Box>
            </RectangleButton>
          </Stack>
        </Box>
      </Fade>
    </>
  );
}
