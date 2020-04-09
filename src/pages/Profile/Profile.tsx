import React from 'react';
import {
  AppBar, Button, Box, Container, IconButton, Typography, TextField,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import AppLayout from '../../components/AppLayout';
import Logo from '../../components/Logo';
import { updateProfile } from '../../services/firebase';

const Profile: React.FC<{}> = () => {
  const history = useHistory();
  const {
    handleSubmit, register, errors,
  } = useForm();
  const onSubmit = React.useCallback(async (values) => {
    try {
      await updateProfile(values);
      Swal.fire(
        'Success!',
        'Your profile has been updated.',
        'success',
      );
      history.push('/lobby');
    } catch (err) {
      Swal.fire(
        'Error!',
        err.message,
        'error',
      );
    }
  }, [history]);

  return (
    <AppLayout>
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
              <Typography variant="h4" style={{ margin: '15px' }}>What’s your name?</Typography>
              <Typography align="center" style={{ marginBottom: '20px' }}>
                To complete the sign up process, please enter your full name.
              </Typography>
              <TextField
                label="Enter your full name"
                name="displayName"
                inputRef={register({
                  required: 'Required',
                })}
                fullWidth
                variant="outlined"
                error={!!errors.displayName}
                helperText={errors.displayName && errors.displayName.message}
                style={{ marginBottom: '20px' }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="secondary"
                style={{ margin: '5px' }}
              >
                Continue
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </AppLayout>
  );
};

export default Profile;
