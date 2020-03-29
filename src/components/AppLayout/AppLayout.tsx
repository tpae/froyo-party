import React from 'react';
import { Pane } from 'evergreen-ui';
import { Container, Row, Col } from 'react-bootstrap';
import Webcam from 'react-webcam';
import RulesCard from '../RulesCard';
import styles from './AppLayout.module.scss';

const videoConstraints = {
  facingMode: 'user',
  aspectRatio: 1,
};

const AppLayout: React.FC<{}> = ({ children }) => (
  <Container fluid className={styles.container}>
    <Row className={styles.row}>
      {children}
      <Col className={styles.col}>
        <Webcam
          audio={false}
          width="100%"
          videoConstraints={videoConstraints}
        />
        <Pane padding="16px">
          <RulesCard title="Froyo Rules">
            <p>We encourage and promote respectful behavior on froyo. Please follow these rules:</p>
            <p>1. We don’t allow nudity or pornography of any kind.</p>
            <p>2. We don’t tolerate harassment, bullying or racism.</p>
            <p>3. We don’t allow illegal activity such as the use or sale of drugs or guns.</p>
            <p>4. Meet new people and have fun!</p>
          </RulesCard>
        </Pane>
      </Col>
    </Row>
  </Container>
);

export default AppLayout;
