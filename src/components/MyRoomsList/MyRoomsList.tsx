/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { MoreVert } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  Box, IconButton, Menu, MenuItem, Link,
} from '@material-ui/core';
import { IRoom } from '../../services/firebase';

const MyRoomsList: React.FC<{
  rooms: IRoom[];
  onJoinRoom: (roomId: string) => void;
}> = ({
  rooms, onJoinRoom,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
            <TableCell>Topics</TableCell>
            <TableCell>People</TableCell>
            <TableCell>Location</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id} hover>
              <TableCell>
                <Link href="#" onClick={handleJoinRoom(room.id)}>
                  {room.name}
                </Link>
              </TableCell>
              <TableCell>{room.topics.join(', ')}</TableCell>
              <TableCell>{Object.keys(room.peers).length}</TableCell>
              <TableCell>{room.location}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="flex-end" justifyContent="flex-end">
                  <IconButton onClick={handleClick}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem>Edit Room</MenuItem>
                    <MenuItem>Delete Room</MenuItem>
                  </Menu>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyRoomsList;
