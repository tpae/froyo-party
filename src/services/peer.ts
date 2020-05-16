import Peer from 'peerjs';
const { REACT_APP_PEER_HOST } = process.env;

export default new Peer(undefined, {
  host: REACT_APP_PEER_HOST,
  secure: true,
  debug: 3,
});
