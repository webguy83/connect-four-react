import { styled } from '@mui/material';
import Button from '@mui/material/Button';

export default styled(Button)(({ theme }) => ({
  borderRadius: 20,
  justifyContent: 'space-between',
  padding: '10px 20px',
  borderWidth: 3,
  borderColor: theme.palette.primary.dark,
  borderStyle: 'solid',
  boxShadow: `0px 10px 0px 0px ${theme.palette.primary.dark}`,
  '&:hover': { borderColor: theme.palette.primary.main, boxShadow: `0px 10px 0px 0px ${theme.palette.primary.main}` },
}));
