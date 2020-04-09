import React from 'react';
import {
  AppBar, Button, Box, Container, IconButton, Typography, TextField,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import AppLayout from '../../components/AppLayout';
import Logo from '../../components/Logo';
import { signInWithEmail, confirmSignInWithEmail } from '../../services/firebase';

const SignUp: React.FC<{}> = () => {
  const {
    handleSubmit, register, errors,
  } = useForm();

  React.useEffect(() => {
    confirmSignInWithEmail();
  }, []);

  const onSubmit = React.useCallback(async (values) => {
    try {
      await signInWithEmail(values);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Check your email for next steps.',
        heightAuto: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.message,
        heightAuto: false,
      });
    }
  }, []);

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
              <img src="/froyos.png" alt="Froyos" style={{ width: '200px' }} />
              <Typography variant="h4" style={{ margin: '15px' }}>Froyo</Typography>
              <Typography align="center" style={{ marginBottom: '20px' }}>
                Video calling for your team, business or friends. Enjoy the ‘office’
                environment without the commute. Collaborate with co-workers, connect
                with students, or catch up with friends. Social distancing has never
                been so sweet.
              </Typography>
              <TextField
                label="Enter your email"
                name="email"
                inputRef={register({
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address',
                  },
                })}
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email && errors.email.message}
                style={{ marginBottom: '20px' }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="secondary"
                style={{ margin: '5px' }}
              >
                Sign up
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </AppLayout>
  );
};

export default SignUp;
