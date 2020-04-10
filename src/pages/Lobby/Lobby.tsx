import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import AllRooms from '../../components/AllRooms';
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
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <AllRooms
          rooms={activeRooms}
          onJoinRoom={handleJoinRoom}
        />
      )}
    </AppLayout>
  );
};

export default Lobby;
