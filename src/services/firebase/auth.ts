import firebase from './config';

export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  picture?: string;
  updatedAt: firebase.firestore.FieldValue;
}

const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();
const provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('email');

export const getProfile = (id: string) => db.collection('users').doc(id).get();

export const setProfile = async ({
  email, displayName, picture,
}) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const user: IUser = {
      uid: currentUser.uid,
      email,
      displayName,
      picture,
      updatedAt: timestamp,
    };
    return db.collection('users').doc(currentUser.uid).set(user);
  }
  return Promise.reject(new Error('You are not signed in.'));
};

export const signInWithFacebook = async () => {
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    if (result.user) {
      await setProfile({
        email: result.user.email,
        displayName: result.user.displayName,
        picture: result.user.photoURL,
      });
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const signOut = () => firebase.auth().signOut();
