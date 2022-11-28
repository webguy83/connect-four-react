import { SxProps, Theme } from '@mui/material';
import { shadowStyle } from '../../utils/Styles';

export const pauseMenuStyles: SxProps<Theme> = (theme) => ({
  ...shadowStyle(theme),
  borderRadius: '4rem',
  color: theme.palette.secondary.light,
  textAlign: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: theme.palette.primary.light,
  p: 4,
  maxWidth: '48rem',
  width: '90vw',

  h2: {
    mt: '2.5rem',
    mb: '5rem',
  },

  '.continue-game-btn, .restart-game-btn': {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.primary.dark,
    justifyContent: 'center',
  },

  '.quit-game-btn': {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.secondary.light,
    justifyContent: 'center',
  },
});
