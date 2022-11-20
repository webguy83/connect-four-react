import { SxProps, Theme } from '@mui/material';

export const rulesRootStyles: SxProps<Theme> = (theme) => ({
  position: 'relative',
  backgroundColor: theme.palette.secondary.light,
  padding: '3.4rem',
  borderRadius: '4rem',
  borderWidth: 3,
  borderColor: theme.palette.primary.dark,
  borderStyle: 'solid',
  boxShadow: `0px 10px 0px 0px ${theme.palette.primary.dark}`,

  '.ruleBlock': {
    mt: '3rem',
  },

  h2: {
    textAlign: 'center',
  },

  h3: {
    my: '1.6rem',
  },

  '& p': {
    opacity: 0.8,
  },

  ol: {
    listStyleType: 'none',
    p: 0,
    li: {
      display: 'flex',
      counterIncrement: 'my-awesome-counter',
      mb: '1rem',
      '&:before': {
        content: 'counter(my-awesome-counter)',
        mr: '2rem',
        width: '1rem',
        fontWeight: 700,
      },

      span: {
        opacity: 0.8,
      },
    },
  },

  button: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',

    '&:hover circle': {
      '&:nth-of-type(1), &:nth-of-type(2)': {
        fill: theme.palette.primary.main,
      },
    },
  },
});
