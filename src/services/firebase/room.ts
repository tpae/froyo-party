import firebase from './config';

const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export interface IRoom {
  name: string;
  location: string;
  topics: string[];
  users: string[];
  maxUsers: number;
  owner: string;
  createdAt: firebase.firestore.FieldValue;
}

export const createRoom = ({
  name, topics, maxUsers, location,
}) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    const room: IRoom = {
      name,
      topics,
      location,
      users: [currentUser.uid],
      maxUsers,
      owner: currentUser.uid,
      createdAt: timestamp,
    };
    return db.collection('rooms').add(room);
  }
  return Promise.reject(new Error('You are not signed in.'));
};
