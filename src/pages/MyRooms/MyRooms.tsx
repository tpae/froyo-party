import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppLayout from '../../components/AppLayout';
import MyRoomsList from '../../components/MyRoomsList';
import RoomFormModal from '../../components/RoomFormModal';
import {
  useMyRooms, deleteRoom, updateRoom, IRoom,
} from '../../services/firebase';

const MyRooms: React.FC<{}> = () => {
  const history = useHistory();
  const [myRooms, myRoomsLoading] = useMyRooms();
  const [showEditRoom, setShowEditRoom] = React.useState<IRoom | undefined>(undefined);
  const openEditRoom = Boolean(showEditRoom);

  const handleJoinRoom = React.useCallback((roomId: string) => {
    history.push(`/room/${roomId}`);
  }, [history]);

  const handleDeleteRoom = React.useCallback(async (roomId: string) => {
    const { value } = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    });
    if (value) {
      await deleteRoom(roomId);
    }
  }, []);

  const handleEditRoom = React.useCallback(async (values: any) => {
    if (showEditRoom) {
      await updateRoom(showEditRoom.id!, {
        ...values,
        topics: values.topics.split(','),
        secret: values.visibility === 'private',
      });
      Swal.fire(
        'Success!',
        'Your room has been updated.',
        'success',
      );
      setShowEditRoom(undefined);
    }
  }, [showEditRoom]);

  const handleEditRoomModal = React.useCallback((roomId: string) => {
    setShowEditRoom(myRooms.find((room) => room.id === roomId));
  }, [myRooms]);

  const handleCloseEditRoomModal = React.useCallback(() => {
    setShowEditRoom(undefined);
  }, []);

  return (
    <AppLayout currentIndex={0}>
      {myRoomsLoading ? (
        <Box height="50vh" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={50} />
        </Box>
      ) : (
        <MyRoomsList
          rooms={myRooms}
          onJoinRoom={handleJoinRoom}
          onEditRoom={handleEditRoomModal}
          onDeleteRoom={handleDeleteRoom}
        />
      )}
      {openEditRoom && (
        <RoomFormModal
          open={openEditRoom}
          onClose={handleCloseEditRoomModal}
          onSubmit={handleEditRoom}
          defaultValues={showEditRoom}
        />
      )}
    </AppLayout>
  );
};

export default MyRooms;
