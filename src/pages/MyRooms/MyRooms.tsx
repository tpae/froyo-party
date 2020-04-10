import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import MyRoomsList from '../../components/MyRoomsList';
import { useMyRooms } from '../../services/firebase';

const MyRooms: React.FC<{}> = () => {
  const history = useHistory();
  const [myRooms, myRoomsLoading] = useMyRooms();

  const handleJoinRoom = React.useCallback((roomId: string) => {
    history.push(`/room/${roomId}`);
  }, [history]);

  return (
    <AppLayout currentIndex={0}>
      {myRoomsLoading ? (
        <Box height="50vh" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={50} />
        </Box>
      ) : (
        <MyRoomsList
          rooms={myRooms}
          onJoinRoom={handleJoinRoom}
        />
      )}
    </AppLayout>
  );
};

export default MyRooms;
