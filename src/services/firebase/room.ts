import { useEffect } from 'react';
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
  owner: string;
  active: boolean;
  createdAt: firebase.firestore.FieldValue;
  updatedAt: firebase.firestore.FieldValue;
}

export const createRoom = async ({
  name, topics, location,
}) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const profile = await getProfile(currentUser.uid);
    const { email: omitted, ...rest } = profile.data() as any;
    const room: IRoom = {
      name,
      topics,
      location,
      users: [],
      profiles: { [currentUser.uid]: rest as IUser },
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

export const getRandomRoom = async ({
  rooms,
  name,
  topics,
  location,
}) => {
  if (rooms.length > 0) {
    return rooms[Math.floor(Math.random() * rooms.length)];
  }
  const room = await createRoom({
    name,
    topics,
    location,
  });
  return room;
};

export const getRandomRoomByTopic = async ({
  rooms, topic, name, location,
}) => {
  const filteredRooms = rooms.filter((room) => room.topics.includes(topic));
  if (filteredRooms.length > 0) {
    return rooms[Math.floor(Math.random() * filteredRooms.length)];
  }
  const room = await createRoom({
    name,
    topics: [topic],
    location,
  });
  return room;
};

export const getToken = firebase.functions().httpsCallable('getToken');

export const usePresence = (roomId: string, userId: string) => {
  useEffect(() => {
    const onlineRef = firebase.database().ref('.info/connected');
    const roomRef = firebase.database().ref(`/rooms/${roomId}/${userId}`);
    onlineRef.on('value', () => {
      roomRef.onDisconnect().set('offline')
        .then(() => {
          roomRef.set('online');
        });
    });
    return () => {
      roomRef.set('offline');
    };
  }, []);
};
