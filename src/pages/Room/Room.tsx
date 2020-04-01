import React from 'react';
import Video from 'twilio-video';
import { Pane } from 'evergreen-ui';
import { Col, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import Participant from '../../components/Participant';
import {
  useRoom, getToken, getCurrentProfile, usePresence,
} from '../../services/firebase';
import styles from './Room.module.scss';

const Room: React.FC<{}> = () => {
  const { roomId } = useParams();
  const history = useHistory();
  const [roomData] = useRoom(roomId);
  const profile = getCurrentProfile();
  const [mute, setMute] = React.useState<boolean | undefined>(undefined);
  const [participants, setParticipants] = React.useState<any[]>([]);
  const [room, setRoom] = React.useState<any>(null);
  usePresence(roomId, profile.uid);

  const handleLeaveRoom = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    history.push('/lobby');
  }, [history]);

  const handleMic = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    room.localParticipant.audioTracks.forEach((trackPublication: any) => {
      trackPublication.track.enable(mute);
    });
    setMute(!mute);
  }, [room, mute, setMute]);

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

      Video.createLocalTracks({
        audio: true,
        video: { aspectRatio: 16 / 9 },
      }).then((localTracks: any) => Video.connect(token, {
        name: roomId,
        tracks: localTracks,
      })).then((twilioRoom: any) => {
        setRoom(twilioRoom);
        setMute(false);
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
    }
  }, [room]);

  return (
    <AppLayout room={roomData} micOn={!mute} onMicToggle={handleMic}>
      <Col className={styles.videoPanel} xs={12} sm={12} md={10}>
        <Pane>
          <Pane display="flex" flexDirection="row" justifyContent="flex-end" marginBottom="16px">
            <Pane>
              <Button onClick={handleLeaveRoom}>Leave Room</Button>
            </Pane>
          </Pane>
          <Pane className={styles.participants}>
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
