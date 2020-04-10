/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from '@material-ui/core';
import { IRoom } from '../../services/firebase';

const AllRoomsList: React.FC<{
  rooms: IRoom[];
  onJoinRoom: (roomId: string) => void;
}> = ({
  rooms, onJoinRoom,
}) => {
  const handleJoinRoom = React.useCallback((event: React.MouseEvent, roomId?: string) => {
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
            <TableCell align="right">Topics</TableCell>
            <TableCell align="right">People</TableCell>
            <TableCell align="right">Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id} hover>
              <TableCell>
                <Link href="#" onClick={(e) => handleJoinRoom(e, room.id)}>
                  {room.name}
                </Link>
              </TableCell>
              <TableCell align="right">{room.topics.join(', ')}</TableCell>
              <TableCell align="right">{Object.keys(room.peers).length}</TableCell>
              <TableCell align="right">{room.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllRoomsList;
