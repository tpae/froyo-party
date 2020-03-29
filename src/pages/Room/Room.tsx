import React from 'react';
import { Pane } from 'evergreen-ui';
import { Col, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import AppLayout from '../../components/AppLayout';
import {
  useRoom, leaveRoom, joinRoom, getCurrentProfile,
} from '../../services/firebase';
import styles from './Room.module.scss';

const Room: React.FC<{}> = () => {
  const { roomId } = useParams();
  const history = useHistory();
  const profile = getCurrentProfile();
  const [room, loading] = useRoom(roomId);
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
            <h3 style={{ color: 'white' }}>Room</h3>
          </Pane>
        </Pane>
      </Col>
    </AppLayout>
  );
};

export default Room;
