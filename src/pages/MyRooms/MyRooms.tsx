import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import AllRooms from '../../components/AllRooms';
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
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <AllRooms
          rooms={myRooms}
          onJoinRoom={handleJoinRoom}
        />
      )}
    </AppLayout>
  );
};

export default MyRooms;
