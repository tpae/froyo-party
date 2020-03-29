import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from './config';

const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export interface IRoom {
  name: string;
  location: string;
  topics: string[];
  users: string[];
  maxUsers: number;
  owner: string;
  active: boolean;
  createdAt: firebase.firestore.FieldValue;
}

export const createRoom = ({
  name, topics, maxUsers, location,
}) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const room: IRoom = {
      name,
      topics,
      location,
      users: [currentUser.uid],
      maxUsers,
      owner: currentUser.uid,
      active: true,
      createdAt: timestamp,
    };
    return db.collection('rooms').add(room);
  }
  return Promise.reject(new Error('You are not signed in.'));
};

export const getRoom = (roomId: string) => db.collection('rooms').doc(roomId).get();

export const joinRoom = async (roomId) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const room = await getRoom(roomId);
    if (!room.exists) { return Promise.reject(new Error('Room does not exist.')); }

    const roomData: IRoom = room.data() as IRoom;
    if (roomData.users.includes(currentUser.uid)) {
      return Promise.reject(new Error('You are already in the room.'));
    }

    if (roomData.users.length === roomData.maxUsers) {
      return Promise.reject(new Error('This room is full.'));
    }

    return room.ref.update({
      users: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
    });
  }
  return Promise.reject(new Error('You are not signed in.'));
};

export const leaveRoom = async (roomId) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const room = await getRoom(roomId);
    if (!room.exists) { return Promise.reject(new Error('Room does not exist.')); }

    const roomData: IRoom = room.data() as IRoom;
    if (!roomData.users.includes(currentUser.uid)) {
      return Promise.reject(new Error('You are not in the room.'));
    }

    return room.ref.update({
      users: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
      active: roomData.users.length - 1 > 0,
    });
  }
  return Promise.reject(new Error('You are not signed in.'));
};

export const useActiveRooms = () => {
  const [value, loading, error] = useCollection(
    db.collection('rooms').where('active', '==', true),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const rooms = value?.empty ? [] : value?.docs.map((room) => (room.data() as IRoom));
  return [rooms, loading, error];
};
