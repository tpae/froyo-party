import React from 'react';
import { Pane } from 'evergreen-ui';
import { Button, Table } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { IRoom } from '../../services/firebase';
import styles from './AllRooms.module.scss';

const AllRooms: React.FC<{
  rooms: IRoom[];
  onJoinRandomRoom: () => void;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}> = ({
  rooms, onJoinRandomRoom, onJoinRoom, onCreateRoom,
}) => {
  const handleJoinRandomRoom = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    onJoinRandomRoom();
  }, [onJoinRandomRoom]);

  const handleCreateRoom = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    onCreateRoom();
  }, [onCreateRoom]);

  const handleJoinRoom = React.useCallback((roomId?: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (roomId) {
      onJoinRoom(roomId);
    }
  }, [onJoinRoom]);

  return (
    <Pane>
      <Pane display="flex" flexDirection="row" justifyContent="space-between" marginBottom="32px">
        <h3>
          All Rooms (
          {rooms.length}
          )
        </h3>
        <Pane display="flex">
          <Button variant="outline-secondary" style={{ marginRight: '12px' }} onClick={handleJoinRandomRoom}>Join Random Room</Button>
          <Button onClick={handleCreateRoom}>Create Room</Button>
        </Pane>
      </Pane>
      <Pane>
        <Table hover className={styles.table}>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Tags</th>
              <th>People</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} onClick={handleJoinRoom(room.id)}>
                <td>{room.name}</td>
                <td>{room.topics.join(', ')}</td>
                <td>
                  <AvatarGroup max={4}>
                    {room.users.map((user) => (
                      <Avatar
                        key={user}
                        alt={room.profiles[user]?.displayName}
                        src={room.profiles[user]?.picture}
                      />
                    ))}
                  </AvatarGroup>
                </td>
                <td>{room.location}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Pane>
    </Pane>
  );
};

export default AllRooms;
