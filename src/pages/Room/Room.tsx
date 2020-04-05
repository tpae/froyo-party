import React from 'react';
import { Pane } from 'evergreen-ui';
import { Col, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import useUserMedia from 'react-use-user-media';
import Peer from 'peerjs';
import AppLayout from '../../components/AppLayout';
import Participant from '../../components/Participant';
import {
  useRoom, getCurrentProfile, usePresence,
} from '../../services/firebase';
import styles from './Room.module.scss';

const constraints = { video: true, audio: true };

const Room: React.FC<{}> = () => {
  const { roomId } = useParams();
  const history = useHistory();
  const [room, loading] = useRoom(roomId);
  const profile = getCurrentProfile();
  const { state, stream } = useUserMedia(constraints);
  const [mute, setMute] = React.useState<boolean | undefined>(undefined);
  const [calls, setCalls] = React.useState<any>({});
  const peerRef = React.useRef<Peer>(new Peer(undefined, {
    host: 'froyo-party.herokuapp.com',
    secure: true,
    debug: 1,
  }));
  const peer = peerRef.current;
  usePresence(roomId, profile.uid, peer);

  const handleLeaveRoom = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    peer.destroy();
    history.push('/lobby');
  }, [history]);

  const handleMic = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    setMute((prevMute) => !prevMute);
  }, [room, setMute]);

  // when a room first opens, dial all the participants.
  React.useEffect(() => {
    // if user has accepted permissions to stream data
    if (state === 'resolved' && stream && peer.id && !loading && room.peers && profile.uid) {
      Object.keys(room.peers).forEach((userId) => {
        if (!calls[userId] && userId !== profile.uid) {
          const call = peer.call(room.peers[userId].peerId, stream, {
            metadata: {
              userId: profile.uid,
            },
          });

          // if user is connected
          call.on('stream', (connectedStream) => {
            setCalls((prevCalls) => ({
              ...prevCalls,
              [userId]: {
                ...prevCalls[userId],
                stream: connectedStream,
                connected: true,
              },
            }));
          });

          // if session is closed
          call.on('close', () => {
            setCalls((prevCalls) => {
              const { [userId]: omitted, ...rest } = prevCalls;
              return rest;
            });
          });

          // if session has an error
          call.on('error', (err) => {
            console.log(err);
            setCalls((prevCalls) => {
              const { [userId]: omitted, ...rest } = prevCalls;
              return rest;
            });
          });

          // initialize default
          setCalls((prevCalls) => ({
            ...prevCalls,
            [userId]: {
              call,
              connected: false,
            },
          }));
        }
      });
    }
  }, [room.peers, calls, state, stream, profile.uid, setCalls, peer.id, loading]);

  // instantiate a listeners to answer calls as they come in.
  React.useEffect(() => {
    if (state === 'resolved' && peer.id && stream) {
      peer.on('call', (call) => {
        const { userId } = call.metadata;
        call.answer(stream);

        // if session is open
        call.on('stream', (connectedStream) => {
          setCalls((prevCalls) => ({
            ...prevCalls,
            [userId]: {
              call,
              stream: connectedStream,
              connected: true,
            },
          }));
        });

        // if session is closed
        call.on('close', () => {
          setCalls((prevCalls) => {
            const { [userId]: omitted, ...rest } = prevCalls;
            return rest;
          });
        });

        // if session has an error
        call.on('error', (err) => {
          console.log(err);
          setCalls((prevCalls) => {
            const { [userId]: omitted, ...rest } = prevCalls;
            return rest;
          });
        });
      });
    }
  }, [state, stream, setCalls, profile.uid, peer]);

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
