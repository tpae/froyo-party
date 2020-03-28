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

export const createProfile = ({
  email, firstName, lastName, picture,
}) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
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
  return Promise.reject(new Error('You are not signed in.'));
};

export const getProfile = (id: string) => db.collection('users').doc(id);
