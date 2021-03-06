import React from 'react';
import {
  Container,
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Box,
  Button,
  IconButton,
} from '@material-ui/core';
import { Mic, MicOff } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import Participant from '../../components/Participant';
import Logo from '../../components/Logo';
import usePeerCalls from '../../hooks/usePeerCalls';
import usePeerState from '../../hooks/usePeerState';
import useUserMedia from '../../hooks/useUserMedia';
import {
  useRoom,
  getCurrentProfile,
  usePresence,
} from '../../services/firebase';
import styles from './Room.module.scss';

const constraints = {
  video: { aspectRatio: 16 / 9, facingMode: 'user' },
  audio: true,
};

const Room: React.FC<{}> = () => {
  const { roomId } = useParams();
  const history = useHistory();
  const [room, loading] = useRoom(roomId);
  const profile = getCurrentProfile();
  const { state, stream } = useUserMedia(constraints);
  const [mute, setMute] = React.useState<boolean>(false);
  usePresence(roomId, profile.uid);
  const [peerState, setSelfState] = usePeerState({
    peers: room.peers,
    loading,
    userId: profile.uid,
    initialState: {
      hasAudio: !mute,
      hasVideo: true,
    },
  });
  // const calls = usePeerCalls({
  //   peers: room.peers,
  //   loading,
  //   userId: profile.uid,
  //   peer,
  //   sourceState: state,
  //   sourceStream: stream,
  // });

  const handleLeaveRoom = React.useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();
      history.push('/lobby');
    },
    [history]
  );

  const handleMic = React.useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();
      if (stream) {
        stream.getAudioTracks()[0].enabled = mute;
        setMute((prevMute) => !prevMute);
        setSelfState((prevState) => ({
          ...prevState,
          hasAudio: !prevState.hasAudio,
        }));
      }
    },
    [mute, stream, setMute, setSelfState]
  );

  console.log(peerState);

  return (
    <Container
      maxWidth={false}
      disableGutters
      style={{
        height: '100%',
      }}>
      <Box className={styles.videoPanel}>
        <AppBar>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between">
            <Box display="flex" flexDirection="row">
              <IconButton size="small">
                <Logo />
              </IconButton>
              <Tabs value={0}>
                <Tab label={room.name} />
              </Tabs>
            </Box>
            <Toolbar variant="dense">
              <IconButton
                size="small"
                style={{ color: 'white' }}
                onClick={handleMic}>
                {mute ? <MicOff /> : <Mic />}
              </IconButton>
            </Toolbar>
            <Toolbar variant="dense">
              <Button
                onClick={handleLeaveRoom}
                variant="contained"
                color="secondary">
                Leave Room
              </Button>
            </Toolbar>
          </Box>
        </AppBar>
        <Box className={styles.participants} paddingTop="75px" margin="0 auto">
          {stream && <Participant stream={stream} muted />}
          {/* {Object.keys(calls).filter((uid) => calls[uid].connected).map((uid) => (
            <Participant key={uid} stream={calls[uid].stream!} />
          ))} */}
        </Box>
      </Box>
    </Container>
  );
};

export default Room;
