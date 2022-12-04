import { Hidden, SxProps, Theme } from '@mui/material';

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
  '.game-board-header': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 'auto',
    button: {
      minWidth: '10.8rem',
    },
  },
  '.central-content': {
    mx: 'auto',
    // overflow: 'hidden',
    [theme.breakpoints.up('mdlg')]: {
      mx: '5rem',
    },
  },
  '.horizontal-scores': {
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

  '.board': {
    position: 'relative',
    width: 'clamp(36rem, 90vw, 63rem)',
    mt: '2.5rem',
    [theme.breakpoints.up('mdlg')]: {
      mt: '5rem',
    },
    '.connectFour': {
      '.invisible-blocks-container': {
        display: 'grid',

        gridTemplateColumns: 'repeat(7, 1fr)',
        position: 'absolute',
        top: 0,
        width: '97.5%',
        height: '89%',
        [theme.breakpoints.up('sm')]: {
          height: '89.5%',
        },
        mt: '1.1%',
        ml: '1.2%',

        '.invisible-block': {
          cursor: 'pointer',
        },
      },
      position: 'relative',
      '.white-grid': {
        position: 'relative',
        zIndex: 1,
      },
      '.black-grid': {
        position: 'absolute',
        top: '.3rem',
        left: 0,
        zIndex: -1,
      },
    },
    '.timer-container': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10,
      marginTop: '-3rem',
      [theme.breakpoints.up('sm')]: {
        marginTop: '-5rem',
      },
    },
    '.piece-block': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      position: 'relative',
    },
  },
  '.piece': {
    //visibility: 'hidden',
    width: '85%',
    height: '90%',
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
