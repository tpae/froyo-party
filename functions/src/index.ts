/* eslint-disable import/prefer-default-export */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();

const getProfile = (id: string) => db.collection('users').doc(id).get();

const getRoom = (roomId: string) => db.collection('rooms').doc(roomId).get();

const joinRoom = async (userId: string, roomId: string, peerId: string) => {
  const profile = await getProfile(userId);
  const room = await getRoom(roomId);
  if (!room.exists) { return Promise.reject(new Error('Room does not exist.')); }

  const { email: omitted, ...rest } = profile.data() as any;
  const roomData = room.data() as any;
  return room.ref.update({
    active: true,
    peers: {
      ...roomData.peers,
      [userId]: {
        peerId,
        profile: rest,
        createdAt: timestamp,
      },
    },
    updatedAt: timestamp,
  });
};

const leaveRoom = async (userId: string, roomId: string) => {
  const room = await getRoom(roomId);
  if (!room.exists) { return Promise.reject(new Error('Room does not exist.')); }

  const roomData = room.data() as any;
  const { [userId]: omittedPeer, ...peers } = roomData.peers;
  return room.ref.update({
    active: Object.keys(peers).length > 0,
    peers,
    updatedAt: timestamp,
  });
};

export const onUserRoomStatusChanged = functions.database
  .ref('/rooms/{roomId}/{userId}')
  .onWrite((event, context) => {
    const { roomId, userId } = context.params;
    return event.after.ref.once('value')
      .then((snapshot) => snapshot.val())
      .then((peerId) => {
        if (peerId !== null) {
          return joinRoom(userId, roomId, peerId);
        }
        return leaveRoom(userId, roomId);
      });
  });
