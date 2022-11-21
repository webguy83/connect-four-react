import { SxProps, Theme } from '@mui/material';

export const gameBoardContainerStyles: SxProps<Theme> = {
  '& header': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    my: '5rem',

    button: {
      minWidth: '10.8rem',
    },
  },

  '& .board': {
    display: 'flex',

    '.grid': {
      position: 'relative',
      maxWidth: '63rem',
      width: '100vw',

      '& > svg': {
        '&:first-of-type': {
          position: 'absolute',
          top: '-1rem',
        },
      },
    },
  },
};
