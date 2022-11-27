import { Theme } from '@mui/material';

export const scoreBoxContainerStyles = (theme: Theme) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  textTransform: 'uppercase',
  p: '4.5rem 3rem 2rem',
  backgroundColor: theme.palette.secondary.light,
  borderRadius: '2rem',
  borderWidth: 3,
  borderColor: theme.palette.primary.dark,
  borderStyle: 'solid',
  boxShadow: `0px 10px 0px 0px ${theme.palette.primary.dark}`,
  fontWeight: 700,
  textAlign: 'center',
  lineHeight: 1.3,
  '& .playerText': {
    fontSize: '1.6rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '2rem',
    },
    m: 0,
  },
  '& .score': {
    lineHeight: 1,
    fontSize: '3.2rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '5.6rem',
    },
    m: 0,
  },
});
