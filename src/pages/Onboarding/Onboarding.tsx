import React from 'react';
import {
  AppBar, Button, Box, Container, IconButton, Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import Logo from '../../components/Logo';
import { signInWithFacebook, signInWithGoogle } from '../../services/firebase';
import styles from './Onboarding.module.scss';

const Onboarding: React.FC<{}> = () => {
  const history = useHistory();
  const handleSignInFacebook = React.useCallback(() => {
    signInWithFacebook();
  }, []);

  const handleSignInGoogle = React.useCallback(() => {
    signInWithGoogle();
  }, []);

  const handleSignUpWithEmail = React.useCallback(() => {
    history.push('/signup');
  }, [history]);

  return (
    <AppLayout hasBackground>
      <AppBar>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="row">
            <IconButton size="small">
              <Logo />
            </IconButton>
          </Box>
          {/* <Toolbar variant="dense">
            <Button variant="contained" style={{ marginRight: '10px' }}>Log In</Button>
            <Button variant="contained" color="secondary">Sign Up</Button>
          </Toolbar> */}
        </Box>
      </AppBar>
      <Box paddingTop="125px" paddingLeft="15px" paddingRight="15px" margin="0 auto">
        <Container maxWidth="sm">
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <img src="/froyos.png" alt="Froyos" style={{ width: '200px' }} />
            <Typography variant="h4" style={{ margin: '15px' }}>Froyo</Typography>
            <Typography align="center" style={{ marginBottom: '20px' }}>
              Video calling for your team, business or friends. Enjoy the ‘office’
              environment without the commute. Collaborate with co-workers, connect
              with students, or catch up with friends. Social distancing has never
              been so sweet.
            </Typography>
            <Button
              variant="contained"
              onClick={handleSignUpWithEmail}
              fullWidth
              color="secondary"
              style={{ margin: '5px' }}
            >
              Sign up with Email
            </Button>
            <Button
              variant="contained"
              onClick={handleSignInFacebook}
              fullWidth
              classes={{ root: styles.facebookButtonRoot }}
              style={{ margin: '5px' }}
            >
              Login with Facebook
            </Button>
            <Button
              variant="outlined"
              onClick={handleSignInGoogle}
              fullWidth
              style={{ margin: '5px' }}
            >
              Login with Google
            </Button>
          </Box>
        </Container>
      </Box>
    </AppLayout>
  );
};

export default Onboarding;
