import firebase from './config';

const provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('email');

export const signInWithFacebook = () => firebase.auth().signInWithPopup(provider);

export const signOut = () => firebase.auth().signOut();
