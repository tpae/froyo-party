import { useEffect } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import Peer from 'peerjs';
import { IUser } from './auth';
import firebase from './config';

const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export interface IRoom {
  id?: string;
  name: string;
  location: string;
  topics: string[];
  peers: Record<string, IPeer>;
  owner: string;
  active: boolean;
  secret: boolean;
  createdAt: firebase.firestore.FieldValue;
  updatedAt: firebase.firestore.FieldValue;
}

export interface IPeer {
  peerId: string;
  profile: IUser;
  createdAt: firebase.firestore.FieldValue;
}

export const createRoom = async ({
  name, topics, location, secret = false,
}) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const room: IRoom = {
      name,
      topics,
      location,
      peers: {},
      owner: currentUser.uid,
      active: true,
      secret,
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
    db.collection('rooms')
      .where('active', '==', true)
      .where('secret', '==', false),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );
  const rooms = value?.docs.map((room) => ({ id: room.id, ...room.data() } as IRoom)) || [];
  return [rooms, loading];
};

export const useMyRooms = (): [IRoom[], boolean] => {
  const { currentUser } = firebase.auth();
  const [value, loading] = useCollection(
    db.collection('rooms')
      .where('owner', '==', currentUser!.uid),
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

export const usePresence = (roomId: string, userId: string, peer: Peer) => {
  useEffect(() => {
    const onlineRef = firebase.database().ref('.info/connected');
    const roomRef = firebase.database().ref(`/rooms/${roomId}/${userId}`);
    onlineRef.on('value', () => {
      roomRef
        .onDisconnect().set(null)
        .then(() => {
          roomRef.set(peer.id);
        });
    });
    return () => {
      roomRef.set(null);
    };
  }, [roomId, userId, peer.id]);
};
