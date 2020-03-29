import firebase from './config';

const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export interface IUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  createdAt: firebase.firestore.FieldValue;
}

export const getProfile = (id: string) => db.collection('users').doc(id).get();

export const createProfile = async ({
  email, firstName, lastName, picture,
}) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const profile = await getProfile(currentUser.uid);
    if (!profile.exists) {
      const user: IUser = {
        uid: currentUser.uid,
        email,
        firstName,
        lastName,
        picture,
        createdAt: timestamp,
      };
      return db.collection('users').add(user);
    }
    return profile;
  }
  return Promise.reject(new Error('You are not signed in.'));
};
