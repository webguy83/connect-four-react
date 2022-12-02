import { SxProps, Theme } from '@mui/material';

export const gameBoardContainerStyles: SxProps<Theme> = (theme) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
  '& > .scoreBox': {
    display: 'none',
    [theme.breakpoints.up('mdlg')]: {
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
    overflow: 'hidden',
    [theme.breakpoints.up('mdlg')]: {
      mx: '5rem',
    },
  },
  '.scores': {
    display: 'flex',
    px: '3rem',
    my: '6rem',
    [theme.breakpoints.up('sm')]: {
      my: '1rem',
    },

    [theme.breakpoints.up('mdlg')]: {
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
    position: 'relative',
    mt: '2.5rem',
    [theme.breakpoints.up('mdlg')]: {
      mt: '5rem',
    },

    '.grid': {
      width: 'clamp(36rem, 90vw, 63rem)',

      '.winner-box': {
        width: '80%',
        maxWidth: '28rem',
      },

      '.connectFour': {
        '.invisible-blocks-container': {
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          position: 'absolute',
          width: '97.5%',
          height: '89%',
          [theme.breakpoints.up('sm')]: {
            height: '89.5%',
          },
          mt: '1.1%',
          ml: '1.2%',
          zIndex: 5,

          '.invisible-block': {
            cursor: 'pointer',
          },
        },
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

export const bottomBarStyles: SxProps<Theme> = (theme) => ({
  width: '100%',
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
  bottom: 0,
  borderTopLeftRadius: '6rem',
  borderTopRightRadius: '6rem',
  zIndex: 0,
});
