import { Button, Container, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { Logout } from '../apiservice';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  button: {
    margin: '8px',
  },
  title: {
    marginBottom: '32px',
  },
}));

const Logoutfun = () => {
  Logout();
  window.location.href = '/';
};

const Dashboard = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Dashboard
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" padding="16px">
        <Box margin="8px">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => handleNavigation('/assignments')}
          >
            Assignments to do
          </Button>
        </Box>
        <Box margin="8px">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => handleNavigation('/reviews')}
          >
            Assignment to Review
          </Button>
        </Box>
        <Box margin="8px">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => handleNavigation('/groups')}
          >
            Groups
          </Button>
        </Box>
        <Box margin="8px">
          <Button
            variant="contained"
            color="info"
            className={classes.button}
            onClick={() => Logoutfun()}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;