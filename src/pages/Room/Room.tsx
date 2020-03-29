import React from 'react';
import Video from 'twilio-video';
import { Pane } from 'evergreen-ui';
import { Col, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import AppLayout from '../../components/AppLayout';
import Participant from '../../components/Participant';
import {
  useRoom, leaveRoom, joinRoom, getCurrentProfile, getToken,
} from '../../services/firebase';
import styles from './Room.module.scss';

const Room: React.FC<{}> = () => {
  const { roomId } = useParams();
  const history = useHistory();
  const profile = getCurrentProfile();
  const [room, loading] = useRoom(roomId);
  const [videoRoom, setVideoRoom] = React.useState<any>(null);
  const [participants, setParticipants] = React.useState<any[]>([]);
  const [token, setToken] = React.useState<string | null>(null);
  const [joinable, setJoinable] = React.useState<boolean>(true);
  const hasCurrentUser = !!room.users && room.users.includes(profile.uid);
  const hasVacancy = !!room.users && room.maxUsers > room.users.length;

  const handleLeaveRoom = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!loading && hasCurrentUser) {
      setJoinable(false);
      await leaveRoom(roomId);
      history.push('/lobby');
    }
  }, [roomId, hasCurrentUser, setJoinable, loading, history]);

  React.useEffect(() => {
    if (!loading && !hasCurrentUser && hasVacancy && joinable) {
      joinRoom(roomId);
    }
  }, [roomId, hasCurrentUser, hasVacancy, joinable, loading]);

  React.useEffect(() => {
    if (!loading && !hasCurrentUser && !hasVacancy) {
      Swal.fire({
        title: 'This room is currently full.',
        onClose: () => {
          history.push('/lobby');
        },
      });
    }
  }, [hasCurrentUser, hasVacancy, loading, history]);

  React.useEffect(() => {
    if (hasCurrentUser) {
      (async function getTokenAsync() {
        const response = await getToken({ roomId });
        setToken(response.data);
      }());
    }
  }, [hasCurrentUser, roomId]);

  const participantConnected = (participant: any) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const participantDisconnected = (participant: any) => {
    setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant));
  };

  React.useEffect(() => {
    if (token && videoRoom === null) {
      Video.connect(token, {
        name: roomId,
      }).then((twilioRoom: any) => {
        setVideoRoom(twilioRoom);
        twilioRoom.on('participantConnected', participantConnected);
        twilioRoom.on('participantDisconnected', participantDisconnected);
        twilioRoom.participants.forEach(participantConnected);
      });
    }

    return () => {
      if (videoRoom && videoRoom.localParticipant.state === 'connected') {
        videoRoom.localParticipant.tracks.forEach((trackPublication: any) => {
          trackPublication.track.stop();
        });
        videoRoom.disconnect();
      }
    };
  }, [roomId, videoRoom, token]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <AppLayout>
      <Col className={styles.videoPanel} xs={9}>
        <Pane>
          <Pane display="flex" flexDirection="row" justifyContent="flex-end" marginBottom="32px">
            <Pane>
              <Button onClick={handleLeaveRoom}>Leave Room</Button>
            </Pane>
          </Pane>
          <Pane>
            {videoRoom ? (
              <Participant
                key={(videoRoom as any).localParticipant.sid}
                participant={(videoRoom as any).localParticipant}
              />
            ) : (
              ''
            )}
            {remoteParticipants}
          </Pane>
        </Pane>
      </Col>
    </AppLayout>
  );
};

export default Room;
