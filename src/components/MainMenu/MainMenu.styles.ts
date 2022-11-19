import { SxProps, Theme } from '@mui/material';

export const MainMenuContainerStyle: SxProps<Theme> = (theme) => ({
  bgcolor: 'primary.light',
  px: 5,
  pt: 8.75,
  pb: 7.5,
  borderWidth: 3,
  borderBottomWidth: 12,
  borderColor: theme.palette.primary.dark,
  borderStyle: 'solid',
});
