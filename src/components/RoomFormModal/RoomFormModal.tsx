import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';

const RoomFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  defaultValues?: any;
}> = ({ open, onClose, onSubmit, defaultValues }) => {
  const { handleSubmit, register, errors, setValue } = useForm({
    defaultValues,
  });

  React.useEffect(() => {
    register({ name: 'visibility' }, { required: true });
    setValue('visibility', 'public');
  }, [register, setValue]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {defaultValues ? 'Edit Room' : 'Create a Room'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <TextField
              label="Room Name"
              name="name"
              inputRef={register({
                required: 'Required',
              })}
              variant="outlined"
              error={!!errors.name}
              helperText={
                errors.name
                  ? errors.name.message
                  : 'This can be your team name, business, friend code etc.'
              }
              style={{ marginBottom: '20px' }}
            />
            <TextField
              label="Topics (comma separated)"
              name="topics"
              inputRef={register({
                required: 'Required',
              })}
              variant="outlined"
              error={!!errors.topics}
              helperText={
                errors.topics
                  ? errors.topics.message
                  : 'Keywords that relate to your room (ie tech, education, fun, music, non-profit)'
              }
              style={{ marginBottom: '20px' }}
            />
            <TextField
              label="Location"
              name="location"
              inputRef={register({
                required: 'Required',
              })}
              variant="outlined"
              error={!!errors.location}
              helperText={errors.location && errors.location.message}
              style={{ marginBottom: '30px' }}
            />
            <FormControl variant="outlined">
              <InputLabel id="room-visibility-label">
                Room Visibility
              </InputLabel>
              <Select
                labelId="room-visibility-label"
                id="room-visibility"
                defaultValue={
                  defaultValues && defaultValues.secret
                    ? 'private'
                    : 'public' || 'public'
                }
                onChange={(e) => setValue('visibility', e.target.value)}
                label="Room Visibility">
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="public">Public</MenuItem>
              </Select>
              <FormHelperText>
                Public rooms can be joined by anyone
              </FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            {defaultValues ? 'Edit Room' : 'Create Room'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RoomFormModal;
