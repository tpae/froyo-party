import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TopTopics from '../../components/TopTopics';
import AllRooms from '../../components/AllRooms';
import styles from './Lobby.module.scss';

const Lobby: React.FC<{}> = () => {
  const handleJoinTopic = React.useCallback((topic: string) => {
    console.log(topic);
  }, []);

  return (
    <Container fluid className={styles.container}>
      <Row className={styles.row}>
        <Col className={styles.col}>
          <TopTopics onJoinTopic={handleJoinTopic} />
        </Col>
        <Col className={styles.mainCol} xs={6}>
          <AllRooms rooms={[]} />
        </Col>
        <Col className={styles.col}>3 of 3</Col>
      </Row>
    </Container>
  );
};

export default Lobby;
