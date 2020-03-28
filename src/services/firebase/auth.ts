import firebase from './config';

export const onAuthStateChanged = (successFn, failureFn) => {
  return firebase.auth().onAuthStateChanged(user => {
    return user ? successFn(user) : failureFn();
  });
};