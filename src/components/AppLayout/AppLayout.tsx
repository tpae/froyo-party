import React from 'react';
import { Container } from '@material-ui/core';

const AppLayout: React.FC<{}> = ({ children }) => (
  <Container maxWidth={false} disableGutters>
    {children}
  </Container>
);

export default AppLayout;
