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
    mx: '5rem',
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
      p: '2rem 3rem',
      gap: '1rem',
    },
  },

  '& .board': {
    display: 'flex',

    '.grid': {
      position: 'relative',
      maxWidth: '63rem',
      width: '90vw',

      '& > svg': {
        '&:first-of-type': {
          position: 'absolute',
          top: '-1rem',
        },
      },
    },
  },
});
