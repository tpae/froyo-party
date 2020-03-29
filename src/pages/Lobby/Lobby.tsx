import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TopTopics from '../../components/TopTopics';
import AllRooms from '../../components/AllRooms';
import CreateRoomModal from '../../components/CreateRoomModal';
import { useActiveRooms, createRoom } from '../../services/firebase';
import styles from './Lobby.module.scss';

const Lobby: React.FC<{}> = () => {
  const [showCreateRoom, setShowCreateRoom] = React.useState<boolean>(false);
  const [rooms, loading] = useActiveRooms();

  const handleJoinTopic = React.useCallback((topic: string) => {
    console.log(topic);
  }, []);

  const handleJoinRandomRoom = React.useCallback(() => {
    console.log('random');
  }, []);

  const handleJoinRoom = React.useCallback((roomId: string) => {
    console.log('join room', roomId);
  }, []);

  const handleCreateRoom = React.useCallback(async (values: any) => {
    await createRoom({
      ...values,
      maxUsers: parseInt(values.maxUsers, 10),
      topics: values.topics.split(','),
    });
    setShowCreateRoom(false);
  }, []);

  const handleShowCreateRoomModal = React.useCallback(() => {
    setShowCreateRoom(true);
  }, []);

  const handleCloseCreateRoomModal = React.useCallback(() => {
    setShowCreateRoom(false);
  }, []);

  return (
    <Container fluid className={styles.container}>
      <Row className={styles.row}>
        <Col className={styles.col}>
          <TopTopics onJoinTopic={handleJoinTopic} />
        </Col>
        <Col className={styles.mainCol} xs={6}>
          <AllRooms
            rooms={rooms}
            onJoinRandomRoom={handleJoinRandomRoom}
            onCreateRoom={handleShowCreateRoomModal}
            onJoinRoom={handleJoinRoom}
          />
          <CreateRoomModal
            show={showCreateRoom}
            onClose={handleCloseCreateRoomModal}
            onSubmit={handleCreateRoom}
          />
        </Col>
        <Col className={styles.col}>3 of 3</Col>
      </Row>
    </Container>
  );
};

export default Lobby;
