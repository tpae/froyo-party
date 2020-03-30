import React from 'react';
import { Col, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import TopTopics from '../../components/TopTopics';
import AllRooms from '../../components/AllRooms';
import CreateRoomModal from '../../components/CreateRoomModal';
import { useActiveRooms, createRoom } from '../../services/firebase';
import { TOPICS } from '../../constants';
import styles from './Lobby.module.scss';

const Lobby: React.FC<{}> = () => {
  const history = useHistory();
  const [showCreateRoom, setShowCreateRoom] = React.useState<boolean>(false);
  const [activeRooms, activeRoomsLoading] = useActiveRooms();

  const handleJoinTopic = React.useCallback(async (topic: string) => {
    const rooms = activeRooms.filter((room) => room.topics.includes(topic));
    if (rooms.length > 0) {
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      history.push(`/room/${room.id}`);
    } else {
      const room = await createRoom({
        name: TOPICS.find((item) => item.tag === topic)?.title,
        topics: [topic],
        location: 'Anywhere',
      });
      history.push(`/room/${room.id}`);
    }
  }, [activeRooms, history]);

  const handleJoinRandomRoom = React.useCallback(async () => {
    if (activeRooms.length > 0) {
      const room = activeRooms[Math.floor(Math.random() * activeRooms.length)];
      history.push(`/room/${room.id}`);
    } else {
      const room = await createRoom({
        name: TOPICS.find((item) => item.tag === 'random')?.title,
        topics: ['random'],
        location: 'Anywhere',
      });
      history.push(`/room/${room.id}`);
    }
  }, [activeRooms, history]);

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
      <Col className={styles.col}>
        <TopTopics onJoinTopic={handleJoinTopic} />
      </Col>
      <Col className={styles.mainCol} xs={8}>
        {activeRoomsLoading ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <AllRooms
            rooms={activeRooms}
            onJoinRandomRoom={handleJoinRandomRoom}
            onCreateRoom={handleShowCreateRoomModal}
            onJoinRoom={handleJoinRoom}
          />
        )}
        <CreateRoomModal
          show={showCreateRoom}
          onClose={handleCloseCreateRoomModal}
          onSubmit={handleCreateRoom}
        />
      </Col>
    </AppLayout>
  );
};

export default Lobby;
