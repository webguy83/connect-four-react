import { SxProps, Theme } from '@mui/material';

export const MainMenuContainerStyle: SxProps<Theme> = (theme) => ({
  bgcolor: 'primary.light',
  pt: 8.75,
  pb: 7.5,
  borderWidth: 3,
  borderColor: 'transparent',
  boxShadow: 'none',
  [theme.breakpoints.up('sm')]: {
    borderColor: theme.palette.primary.dark,
    boxShadow: `0px 10px 0px 0px ${theme.palette.primary.dark}`,
    px: 5,
    pt: 8.75,
    pb: 7.5,
  },
  borderStyle: 'solid',
});
