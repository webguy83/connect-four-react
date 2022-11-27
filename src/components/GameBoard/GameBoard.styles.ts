import { SxProps, Theme } from '@mui/material';

export const gameBoardContainerStyles: SxProps<Theme> = (theme) => ({
  display: 'flex',
  alignItems: 'center',
  '& > .scoreBox': {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  '& header': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: '5rem',
    button: {
      minWidth: '10.8rem',
    },
  },
  '.group': {
    mx: 'auto',
    [theme.breakpoints.up('md')]: {
      mx: '5rem',
    },
  },
  '.scores': {
    display: 'flex',
    px: '2rem',
    my: '5rem',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    justifyContent: 'space-between',
    textTransform: 'uppercase',

    '& .scoreBox': {
      width: '48%',
      p: '1rem 3rem',
      [theme.breakpoints.up('sm')]: {
        p: '2rem 3rem',
      },
      gap: '1rem',
    },
  },

  '& .board': {
    display: 'flex',

    '.grid': {
      position: 'relative',
      maxWidth: '63rem',
      width: '90vw',

      '.winner-box': {
        position: 'absolute',
        bottom: '-10rem',
        width: '80%',
        maxWidth: '28rem',
        zIndex: 3,
        left: '50%',
        transform: 'translateX(-50%)',
      },

      '& > svg': {
        '&:first-of-type': {
          position: 'absolute',
          top: '-1rem',
        },
      },
    },
  },
});
