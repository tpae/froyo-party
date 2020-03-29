import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './AppLayout.module.scss';

const AppLayout: React.FC<{}> = ({ children }) => (
  <Container fluid className={styles.container}>
    <Row className={styles.row}>
      {children}
      <Col className={styles.col}>3 of 3</Col>
    </Row>
  </Container>
);

export default AppLayout;
