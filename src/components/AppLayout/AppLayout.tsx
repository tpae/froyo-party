import React from 'react';
import {
  Container, AppBar, Tabs, Tab, Toolbar, Box, Button, IconButton, Menu, MenuItem,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Logo from '../../components/Logo';
import CreateRoomModal from '../../components/CreateRoomModal';
import {
  createRoom, signOut, useProfile,
} from '../../services/firebase';

const AppLayout: React.FC<{
  currentIndex?: number;
}> = ({ children, currentIndex }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const [profile, loading] = useProfile();
  const [showCreateRoom, setShowCreateRoom] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!loading && !profile!.exists) {
      history.push('/profile');
    }
  }, [profile, loading, history]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateRoom = React.useCallback(async (values: any) => {
    const room = await createRoom({
      ...values,
      topics: values.topics.split(','),
      private: values.visibility === 'private',
    });
    history.push(`/room/${room.id}`);
  }, [history]);

  const handleSignOut = () => {
    signOut();
  };

  const handleShowCreateRoomModal = React.useCallback(() => {
    setShowCreateRoom(true);
  }, []);

  const handleCloseCreateRoomModal = React.useCallback(() => {
    setShowCreateRoom(false);
  }, []);

  const handleNavigation = React.useCallback((path) => {
    history.push(path);
  }, [history]);

  return (
    <Container
      maxWidth={false}
      disableGutters
      style={{ height: '100%' }}
    >
      <AppBar>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="row">
            <IconButton size="small">
              <Logo />
            </IconButton>
            <Tabs value={currentIndex}>
              <Tab label="My Rooms" onClick={() => handleNavigation('/rooms')} />
              <Tab label="Public Rooms" onClick={() => handleNavigation('/lobby')} />
            </Tabs>
          </Box>
          <Toolbar variant="dense">
            <IconButton onClick={handleClick} style={{ color: 'white' }}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
            <Button onClick={handleShowCreateRoomModal} variant="contained" color="secondary">Create Room</Button>
          </Toolbar>
        </Box>
      </AppBar>
      <Box paddingTop="75px" paddingLeft="15px" paddingRight="15px" margin="0 auto">
        {children}
        <CreateRoomModal
          open={showCreateRoom}
          onClose={handleCloseCreateRoomModal}
          onSubmit={handleCreateRoom}
        />
      </Box>
    </Container>
  );
};

export default AppLayout;
