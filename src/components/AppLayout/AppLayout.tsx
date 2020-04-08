import React from 'react';
import { Container } from '@material-ui/core';

const AppLayout: React.FC<{
  hasBackground?: boolean;
}> = ({ children, hasBackground }) => (
  <Container
    maxWidth={false}
    disableGutters
    style={{
      background: hasBackground ? 'url(/wave.svg) no-repeat bottom center' : undefined,
      height: '100%',
    }}
  >
    {children}
  </Container>
);

export default AppLayout;
