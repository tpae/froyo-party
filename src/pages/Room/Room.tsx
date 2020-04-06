import React from 'react';
import { Pane } from 'evergreen-ui';
import { Col, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import useUserMedia from 'react-use-user-media';
import Peer from 'peerjs';
import AppLayout from '../../components/AppLayout';
import Participant from '../../components/Participant';
import usePeerCalls from '../../hooks/usePeerCalls';
import {
  useRoom, getCurrentProfile, usePresence,
} from '../../services/firebase';
import styles from './Room.module.scss';

const { REACT_APP_PEER_HOST } = process.env;

const Room: React.FC<{}> = () => {
  const { roomId } = useParams();
  const history = useHistory();
  const [room, loading] = useRoom(roomId);
  const profile = getCurrentProfile();
  const { state, stream } = useUserMedia({ video: true, audio: true });
  const [mute, setMute] = React.useState<boolean | undefined>(undefined);
  const peerRef = React.useRef<Peer>(new Peer(undefined, {
    host: REACT_APP_PEER_HOST,
    secure: true,
  }));
  const peer = peerRef.current;
  usePresence(roomId, profile.uid, peer);

  const calls = usePeerCalls({
    peers: room.peers,
    loading,
    userId: profile.uid,
    peer,
    mediaState: state,
    mediaStream: stream,
  });

  const handleLeaveRoom = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    peer.destroy();
    history.push('/lobby');
  }, [history]);

  const handleMic = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    setMute((prevMute) => !prevMute);
  }, [room, setMute]);

  return (
    <AppLayout room={room} micOn={!mute} onMicToggle={handleMic}>
      <Col className={styles.videoPanel} xs={12} sm={12} md={10}>
        <Pane>
          <Pane display="flex" flexDirection="row" justifyContent="flex-end" marginBottom="16px">
            <Pane>
              <Button onClick={handleLeaveRoom}>Leave Room</Button>
            </Pane>
          </Pane>
          <Pane className={styles.participants}>
            {Object.keys(calls).filter((uid) => calls[uid].connected).map((uid) => (
              <Participant key={uid} stream={calls[uid].stream} />
            ))}
          </Pane>
        </Pane>
      </Col>
    </AppLayout>
  );
};

export default Room;
