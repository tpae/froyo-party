import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import AllRoomsList from '../../components/AllRoomsList';
import { useActiveRooms } from '../../services/firebase';

const Lobby: React.FC<{}> = () => {
  const history = useHistory();
  const [activeRooms, activeRoomsLoading] = useActiveRooms();

  const handleJoinRoom = React.useCallback((roomId: string) => {
    history.push(`/room/${roomId}`);
  }, [history]);

  return (
    <AppLayout currentIndex={1}>
      {activeRoomsLoading ? (
        <Box height="50vh" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={50} />
        </Box>
      ) : (
        <AllRoomsList
          rooms={activeRooms}
          onJoinRoom={handleJoinRoom}
        />
      )}
    </AppLayout>
  );
};

export default Lobby;
