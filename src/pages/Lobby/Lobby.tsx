import React from 'react';
import { Spinner } from 'react-bootstrap';
import {
  AppBar, Tabs, Tab, Toolbar, Box, Button, IconButton, Menu, MenuItem,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import AllRooms from '../../components/AllRooms';
import Logo from '../../components/Logo';
import CreateRoomModal from '../../components/CreateRoomModal';
import {
  useActiveRooms, createRoom, signOut,
} from '../../services/firebase';

const Lobby: React.FC<{}> = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const [showCreateRoom, setShowCreateRoom] = React.useState<boolean>(false);
  const [activeRooms, activeRoomsLoading] = useActiveRooms();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleJoinRoom = React.useCallback((roomId: string) => {
    history.push(`/room/${roomId}`);
  }, [history]);

  const handleCreateRoom = React.useCallback(async (values: any) => {
    const room = await createRoom({
      ...values,
      topics: values.topics.split(','),
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

  return (
    <AppLayout>
      <AppBar>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="row">
            <IconButton size="small">
              <Logo />
            </IconButton>
            <Tabs value={0}>
              <Tab label="Public Rooms" />
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
        {activeRoomsLoading ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <AllRooms
            rooms={activeRooms}
            onJoinRoom={handleJoinRoom}
          />
        )}
        <CreateRoomModal
          open={showCreateRoom}
          onClose={handleCloseCreateRoomModal}
          onSubmit={handleCreateRoom}
        />
      </Box>
    </AppLayout>
  );
};

export default Lobby;
