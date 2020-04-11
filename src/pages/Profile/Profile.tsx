import React from 'react';
import {
  Button,
  Box,
  Container,
  Typography,
  TextField,
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import AppLayout from '../../components/AppLayout';
import { updateProfile } from '../../services/firebase';

const Profile: React.FC<{}> = () => {
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/lobby' } };
  const { handleSubmit, register, errors } = useForm();
  const onSubmit = React.useCallback(
    async (values) => {
      try {
        await updateProfile(values);
        Swal.fire('Success!', 'Your profile has been updated.', 'success');
        history.push(from);
      } catch (err) {
        Swal.fire('Error!', err.message, 'error');
      }
    },
    [history, from]
  );

  return (
    <AppLayout>
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column">
            <img src="/froyos.png" alt="Froyos" style={{ width: '200px' }} />
            <Typography variant="h4" style={{ margin: '15px' }}>
              What’s your name?
            </Typography>
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
              style={{ margin: '5px' }}>
              Continue
            </Button>
          </Box>
        </form>
      </Container>
    </AppLayout>
  );
};

export default Profile;
