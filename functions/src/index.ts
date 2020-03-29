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

export const getToken = functions.https.onCall(async (data, context) => {
  const room = await db.collection('rooms').doc(data.roomId).get();
  if (room.exists && context.auth) {
    const user = context.auth.uid;
    if (room.data()!.users.includes(user)) {
      return videoToken(user, room.id);
    }
  }
  return null;
});
