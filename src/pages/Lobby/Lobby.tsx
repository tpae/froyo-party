import React from 'react';
import { Col, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import TopTopics from '../../components/TopTopics';
import AllRooms from '../../components/AllRooms';
import CreateRoomModal from '../../components/CreateRoomModal';
import {
  useActiveRooms, createRoom, getRandomRoom, getRandomRoomByTopic,
} from '../../services/firebase';
import { TOPICS } from '../../constants';
import styles from './Lobby.module.scss';

const Lobby: React.FC<{}> = () => {
  const history = useHistory();
  const { topic: topicParam } = useParams();
  const [showCreateRoom, setShowCreateRoom] = React.useState<boolean>(false);
  const [activeRooms, activeRoomsLoading] = useActiveRooms();

  const handleJoinTopic = React.useCallback(async (topic: string) => {
    const room = await getRandomRoomByTopic({
      rooms: activeRooms,
      topic,
      name: TOPICS.find((item) => item.tag === topic)?.title as string,
      location: 'Anywhere',
    });
    history.push(`/room/${room.id}`);
  }, [activeRooms, history]);

  const handleJoinRandomRoom = React.useCallback(async () => {
    const room = await getRandomRoom({
      rooms: activeRooms,
      name: TOPICS.find((item) => item.tag === 'random')?.title as string,
      topics: ['random'],
      location: 'Anywhere',
    });
    history.push(`/room/${room.id}`);
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

  React.useEffect(() => {
    (async function initializeVideo() {
      if (topicParam && !activeRoomsLoading) {
        const room = await getRandomRoomByTopic({
          rooms: activeRooms,
          topic: topicParam,
          name: TOPICS.find((item) => item.tag === topicParam)?.title as string || topicParam,
          location: 'Anywhere',
        });
        history.push(`/room/${room.id}`);
      }
    }());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicParam, activeRoomsLoading]);

  return (
    <AppLayout>
      <Col className={styles.col} xs={12} sm={3} md={2}>
        <TopTopics onJoinTopic={handleJoinTopic} />
      </Col>
      <Col className={styles.mainCol} xs={12} sm={6} md={8}>
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
