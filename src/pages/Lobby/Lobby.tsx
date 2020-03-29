import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TopicCard from '../../components/TopicCard';
import styles from './Lobby.module.scss';
import { TOPICS } from '../../constants';

const Lobby: React.FC<{}> = () => {
  const handleJoinTopic = React.useCallback((topic: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    console.log(topic);
  }, []);

  return (
    <Container fluid className={styles.container}>
      <Row className={styles.row}>
        <Col className={styles.col}>
          <h3>Top Topics</h3>
          {TOPICS.map((topic) => (
            <TopicCard
              key={topic.tag}
              title={topic.title}
              description={topic.description}
              onClick={handleJoinTopic(topic.tag)}
            />
          ))}
        </Col>
        <Col xs={6}>2 of 3 (wider)</Col>
        <Col className={styles.col}>3 of 3</Col>
      </Row>
    </Container>
  );
};

export default Lobby;
