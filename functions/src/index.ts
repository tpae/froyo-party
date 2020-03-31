/* eslint-disable import/prefer-default-export */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as twilio from 'twilio';

const { AccessToken } = twilio.jwt;
const { VideoGrant } = AccessToken;

const twilioAccountSid = 'ACf6eada07ef3cfbd97ffb66d9a341bb5e';
const twilioApiKey = 'SK1f48fe49ee864088bf1c1be4c8c22a84';
const twilioApiSecret = 'n5ftaWlJ0F1B93lstDN8jGOQqd5frIUZ';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();

const generateToken = (options: any) => new AccessToken(
  twilioAccountSid,
  twilioApiKey,
  twilioApiSecret,
  options,
);

const videoToken = (identity: string, room: string) => {
  const videoGrant = new VideoGrant({ room });
  const token = generateToken({ identity });
  token.addGrant(videoGrant);
  return token.toJwt();
};

const getProfile = (id: string) => db.collection('users').doc(id).get();

const getRoom = (roomId: string) => db.collection('rooms').doc(roomId).get();

const joinRoom = async (userId: string, roomId: string) => {
  const profile = await getProfile(userId);
  const room = await getRoom(roomId);
  if (!room.exists) { return Promise.reject(new Error('Room does not exist.')); }

  const { email: omitted, ...rest } = profile.data() as any;
  return room.ref.update({
    users: admin.firestore.FieldValue.arrayUnion(userId),
    active: true,
    profiles: { ...room.data()!.profiles, [userId]: rest },
    updatedAt: timestamp,
  });
};

const leaveRoom = async (userId: string, roomId: string) => {
  const room = await getRoom(roomId);
  if (!room.exists) { return Promise.reject(new Error('Room does not exist.')); }

  const { [userId]: omitted, ...profiles } = room.data()!.profiles;
  return room.ref.update({
    users: admin.firestore.FieldValue.arrayRemove(userId),
    active: room.data()!.users.length - 1 > 0,
    profiles,
    updatedAt: timestamp,
  });
};

export const getToken = functions.https.onCall(async (data, context) => {
  const room = await db.collection('rooms').doc(data.roomId).get();
  if (room.exists && context.auth) {
    const user = context.auth.uid;
    return videoToken(user, room.id);
  }
  return null;
});

export const onUserRoomStatusChanged = functions.database
  .ref('/rooms/{roomId}/{userId}')
  .onWrite((event, context) => {
    const { roomId, userId } = context.params;
    return event.after.ref.once('value')
      .then((snapshot) => snapshot.val())
      .then((status) => {
        if (status === 'online') {
          return joinRoom(userId, roomId);
        }
        return leaveRoom(userId, roomId);
      });
  });
