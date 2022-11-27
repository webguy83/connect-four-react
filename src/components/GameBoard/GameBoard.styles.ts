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
    mt: 'auto',
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
    my: '6rem',
    [theme.breakpoints.up('sm')]: {
      my: '1rem',
    },

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
    mt: '2.5rem',
    [theme.breakpoints.up('md')]: {
      mt: '5rem',
    },

    '.grid': {
      position: 'relative',
      maxWidth: '63rem',
      width: '90vw',

      '.winner-box': {
        width: '80%',
        maxWidth: '28rem',
      },

      '.connectFour': {
        position: 'relative',
        '& > svg': {
          '&:last-of-type': {
            position: 'absolute',
            top: '.3rem',
            left: 0,
            zIndex: -1,
          },
        },
      },
    },
    '.lower-block': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      marginTop: '-3rem',
      [theme.breakpoints.up('sm')]: {
        marginTop: '-5rem',
      },
    },
  },
});
