import { useDocument } from 'react-firebase-hooks/firestore';
import firebase from './config';

export interface IUser {
  uid: string;
  email?: string;
  displayName: string;
  picture?: string | null;
  updatedAt: firebase.firestore.FieldValue;
}

const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

facebookProvider.addScope('email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export const getProfile = (id: string) => db.collection('users').doc(id).get();

export const getCurrentProfile = () => firebase.auth().currentUser!;

export const useProfile = () => {
  const { currentUser } = firebase.auth();
  return useDocument(db.collection('users').doc(currentUser!.uid), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
};

export const setProfile = async ({ email, displayName, picture }) => {
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

export const updateProfile = async ({ displayName }) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const user: IUser = {
      uid: currentUser.uid,
      email: currentUser.email!,
      displayName,
      picture: null,
      updatedAt: timestamp,
    };
    return db.collection('users').doc(currentUser.uid).set(user);
  }
  return Promise.reject(new Error('You are not signed in.'));
};

export const signInWithEmail = async ({ email }) => {
  try {
    await firebase.auth().sendSignInLinkToEmail(email, {
      url: window.location.href,
      handleCodeInApp: true,
    });
    window.localStorage.setItem('emailForSignIn', email);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const confirmSignInWithEmail = async () => {
  try {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      await firebase.auth().signInWithEmailLink(email!, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await firebase.auth().signInWithPopup(facebookProvider);
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

export const signInWithGoogle = async () => {
  try {
    const result = await firebase.auth().signInWithPopup(googleProvider);
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
