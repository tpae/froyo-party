import React from 'react';
import { Pane } from 'evergreen-ui';
import {
  Button, Container, Row, Col,
} from 'react-bootstrap';
import Webcam from 'react-webcam';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Swal from 'sweetalert2';

import TextCard from '../TextCard';
import styles from './AppLayout.module.scss';
import { IRoom, signOut } from '../../services/firebase';

const videoConstraints = {
  facingMode: 'user',
  aspectRatio: 16 / 9,
};

const AppLayout: React.FC<{
  room?: IRoom;
}> = ({ room, children }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAbout = () => {
    setAnchorEl(null);
    Swal.fire('Thanks for trying this out! 🙇‍♂️');
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Container fluid className={styles.container}>
      <Row className={styles.row}>
        {children}
        <Col className={styles.col} xs={2}>
          <Webcam
            audio={false}
            width="100%"
            mirrored
            videoConstraints={videoConstraints}
          />
          <Pane flex="1" flexGrow="100" overflow="auto" padding="16px">
            {room?.id && (
            <TextCard title="Room Info">
              <p>
                Name:
                {' '}
                {room.name}
              </p>
              <p>
                Tags:
                {' '}
                {room.topics.join(', ')}
              </p>
              <p>
                People:
                {' '}
                {room.users.length}
              </p>
              <p>
                Location:
                {' '}
                {room.location}
              </p>
            </TextCard>
          )}
            <TextCard title="Froyo Rules">
              <p>We encourage and promote respectful behavior on froyo. Please follow these rules:</p>
              <p>1. We don’t allow nudity or pornography of any kind.</p>
              <p>2. We don’t tolerate harassment, bullying or racism.</p>
              <p>3. We don’t allow illegal activity such as the use or sale of drugs or guns.</p>
              <p>4. Meet new people and have fun!</p>
            </TextCard>
          </Pane>
          <Pane
            padding="10px"
            paddingRight="0"
            marginLeft="1px"
            flex="1"
            height="80px"
            backgroundColor="#ffffff"
            display="flex"
            justifyContent="space-between"
          >
            <img src="/logo.svg" alt="Froyo" />
            <Pane>
              <Button>Share froyo</Button>
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleAbout}>About</MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </Pane>
          </Pane>
        </Col>
      </Row>
    </Container>
  );
};

export default AppLayout;
