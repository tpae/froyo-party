import React from 'react';
import {
  Container, AppBar, Box, IconButton,
} from '@material-ui/core';
import Logo from '../../components/Logo';

const AppLayout: React.FC<{}> = ({ children }) => (
  <Container
    maxWidth={false}
    disableGutters
    style={{
      background: 'url(/wave.svg) no-repeat bottom center',
      backgroundSize: '100%',
      height: '100%',
    }}
  >
    <AppBar>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box display="flex" flexDirection="row">
          <IconButton size="small">
            <Logo />
          </IconButton>
        </Box>
        {/* <Toolbar variant="dense">
            <Button variant="contained" style={{ marginRight: '10px' }}>Log In</Button>
            <Button variant="contained" color="secondary">Sign Up</Button>
          </Toolbar> */}
      </Box>
    </AppBar>
    <Box paddingTop="125px" paddingLeft="15px" paddingRight="15px" margin="0 auto">
      {children}
    </Box>
  </Container>
);

export default AppLayout;
