import React from 'react';
import { Col } from 'react-bootstrap';
import AppLayout from '../../components/AppLayout';

const Room: React.FC<{}> = () => (
  <AppLayout>
    <Col style={{ backgroundColor: '#222222' }} xs={9}>
      <h3 style={{ color: 'white' }}>Room</h3>
    </Col>
  </AppLayout>
);

export default Room;
