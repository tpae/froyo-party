import React from 'react';
import Video from 'twilio-video';
import { Pane } from 'evergreen-ui';
import { Col, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import Participant from '../../components/Participant';
import {
  useRoom, leaveRoom, joinRoom, getToken,
} from '../../services/firebase';
import styles from './Room.module.scss';

const Room: React.FC<{}> = () => {
  const { roomId } = useParams();
  const history = useHistory();
  const [roomData] = useRoom(roomId);
  const [participants, setParticipants] = React.useState<any[]>([]);
  const [room, setRoom] = React.useState<any>(null);

  const handleLeaveRoom = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    history.push('/lobby');
  }, [history]);

  const participantConnected = (participant: any) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const participantDisconnected = (participant: any) => {
    setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant));
  };

  React.useEffect(() => {
    (async function initializeVideo() {
      const response = await getToken({ roomId });
      const token = response.data as string;
      Video.connect(token, {
        name: roomId,
      }).then((twilioRoom: any) => {
        setRoom(twilioRoom);
        joinRoom(twilioRoom.localParticipant.identity, twilioRoom.name);
        twilioRoom.on('participantConnected', participantConnected);
        twilioRoom.on('participantDisconnected', participantDisconnected);
        twilioRoom.participants.forEach(participantConnected);
      });
    }());
  }, [roomId]);

  React.useEffect(() => () => {
    if (room && room.localParticipant.state === 'connected') {
      room.localParticipant.tracks.forEach((trackPublication: any) => {
        trackPublication.track.stop();
      });
      room.disconnect();
      leaveRoom(room.localParticipant.identity, room.name);
    }
  }, [room]);

  return (
    <AppLayout room={roomData}>
      <Col className={styles.videoPanel} xs={10}>
        <Pane>
          <Pane display="flex" flexDirection="row" justifyContent="flex-end" marginBottom="32px">
            <Pane>
              <Button onClick={handleLeaveRoom}>Leave Room</Button>
            </Pane>
          </Pane>
          <Pane>
            {participants.map((participant) => (
              <Participant key={participant.sid} participant={participant} />
            ))}
          </Pane>
        </Pane>
      </Col>
    </AppLayout>
  );
};

export default Room;
