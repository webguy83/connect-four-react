import { SxProps, Theme } from '@mui/material';

export const MainMenuContainerStyle: SxProps<Theme> = (theme) => ({
  bgcolor: 'primary.light',
  px: 5,
  pt: 8.75,
  pb: 7.5,
  borderWidth: 3,
  borderColor: theme.palette.primary.dark,
  borderStyle: 'solid',
  boxShadow: `0px 10px 0px 0px ${theme.palette.primary.dark}`,
});
