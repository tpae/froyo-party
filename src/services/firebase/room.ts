import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { getProfile, IUser } from './auth';
import firebase from './config';

const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export interface IRoom {
  id?: string;
  name: string;
  location: string;
  topics: string[];
  users: string[];
  profiles: Record<string, IUser | undefined>;
  maxUsers: number;
  owner: string;
  active: boolean;
  createdAt: firebase.firestore.FieldValue;
  updatedAt: firebase.firestore.FieldValue;
}

export const createRoom = async ({
  name, topics, maxUsers, location,
}) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const profile = await getProfile(currentUser.uid);
    const room: IRoom = {
      name,
      topics,
      location,
      users: [currentUser.uid],
      profiles: { [currentUser.uid]: profile.data() as IUser },
      maxUsers,
      owner: currentUser.uid,
      active: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    return db.collection('rooms').add(room);
  }
  return Promise.reject(new Error('You are not signed in.'));
};

export const getRoom = (roomId: string) => db.collection('rooms').doc(roomId).get();

export const joinRoom = async (roomId: string) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const profile = await getProfile(currentUser.uid);
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
      active: true,
      profiles: { ...roomData.profiles, [currentUser.uid]: profile.data() },
      updatedAt: timestamp,
    });
  }
  return Promise.reject(new Error('You are not signed in.'));
};

export const leaveRoom = async (roomId: string) => {
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
      updatedAt: timestamp,
    });
  }
  return Promise.reject(new Error('You are not signed in.'));
};

export const useActiveRooms = (): [IRoom[], boolean] => {
  const [value, loading] = useCollection(
    db.collection('rooms').where('active', '==', true),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const rooms = value?.docs.map((room) => ({ id: room.id, ...room.data() } as IRoom)) || [];
  return [rooms, loading];
};

export const useRoom = (roomId: string): [IRoom, boolean] => {
  const [value, loading] = useDocument(
    db.collection('rooms').doc(roomId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const room = ({ id: value?.id, ...value?.data() } as IRoom);
  return [room, loading];
};

export const useCurrentRoom = (): [IRoom | undefined, boolean] => {
  const { currentUser } = firebase.auth();
  const [value, loading] = useCollection(
    db.collection('rooms').where('users', 'array-contains', currentUser!.uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const currentRoom = value?.docs[0];
  return [({ id: currentRoom?.id, ...currentRoom?.data() } as IRoom), loading];
};
