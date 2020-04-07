import React from 'react';
import { Spinner } from 'react-bootstrap';
import {
  AppBar, Tabs, Tab, Toolbar, Box, Button, IconButton,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import AllRooms from '../../components/AllRooms';
import Logo from '../../components/Logo';
import CreateRoomModal from '../../components/CreateRoomModal';
import {
  useActiveRooms, createRoom,
} from '../../services/firebase';

const Lobby: React.FC<{}> = () => {
  const history = useHistory();
  const [showCreateRoom, setShowCreateRoom] = React.useState<boolean>(false);
  const [activeRooms, activeRoomsLoading] = useActiveRooms();

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
