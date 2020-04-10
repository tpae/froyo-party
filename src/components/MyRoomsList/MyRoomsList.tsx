/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from '@material-ui/core';
import MyRoomsMenu from '../MyRoomsMenu';
import { IRoom } from '../../services/firebase';

const MyRoomsList: React.FC<{
  rooms: IRoom[];
  onJoinRoom: (roomId: string) => void;
  onEditRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
}> = ({
  rooms, onJoinRoom, onEditRoom, onDeleteRoom,
}) => {
  const handleJoinRoom = React.useCallback((event: React.MouseEvent, roomId?: string) => {
    event.preventDefault();
    if (roomId) {
      onJoinRoom(roomId);
    }
  }, [onJoinRoom]);

  const handleEditRoom = React.useCallback((event: React.MouseEvent, roomId?: string) => {
    event.preventDefault();
    if (roomId) {
      onEditRoom(roomId);
    }
  }, [onEditRoom]);

  const handleDeleteRoom = React.useCallback((event: React.MouseEvent, roomId?: string) => {
    event.preventDefault();
    if (roomId) {
      onDeleteRoom(roomId);
    }
  }, [onDeleteRoom]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room Name</TableCell>
            <TableCell align="right">Topics</TableCell>
            <TableCell align="right">People</TableCell>
            <TableCell align="right">Location</TableCell>
            <TableCell align="right" />
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
              <TableCell align="right">
                <MyRoomsMenu
                  onEdit={(e) => handleEditRoom(e, room.id)}
                  onDelete={(e) => handleDeleteRoom(e, room.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyRoomsList;
