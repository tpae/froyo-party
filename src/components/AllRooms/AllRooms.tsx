import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { IRoom } from '../../services/firebase';

const AllRooms: React.FC<{
  rooms: IRoom[];
  onJoinRoom: (roomId: string) => void;
}> = ({
  rooms, onJoinRoom,
}) => {
  const handleJoinRoom = React.useCallback((roomId?: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (roomId) {
      onJoinRoom(roomId);
    }
  }, [onJoinRoom]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room Name</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>People</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id} onClick={handleJoinRoom(room.id)} hover>
              <TableCell>{room.name}</TableCell>
              <TableCell>{room.topics.join(', ')}</TableCell>
              <TableCell>{Object.keys(room.peers).length}</TableCell>
              <TableCell>{room.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllRooms;
