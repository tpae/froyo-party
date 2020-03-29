import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TopTopics from '../../components/TopTopics';
import AllRooms from '../../components/AllRooms';
import { useActiveRooms } from '../../services/firebase';
import styles from './Lobby.module.scss';

const Lobby: React.FC<{}> = () => {
  const [rooms, loading] = useActiveRooms();

  const handleJoinTopic = React.useCallback((topic: string) => {
    console.log(topic);
  }, []);

  const handleJoinRandomRoom = React.useCallback(() => {
    console.log('random');
  }, []);

  const handleCreateRoom = React.useCallback(() => {
    console.log('create room');
  }, []);

  const handleJoinRoom = React.useCallback((roomId: string) => {
    console.log('join room', roomId);
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
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />
        </Col>
        <Col className={styles.col}>3 of 3</Col>
      </Row>
    </Container>
  );
};

export default Lobby;
