import Pusher from 'pusher-js';

const { REACT_APP_PUSHER_APP_KEY, REACT_APP_PUSHER_APP_CLUSTER } = process.env;

export default new Pusher(REACT_APP_PUSHER_APP_KEY as string, {
  cluster: REACT_APP_PUSHER_APP_CLUSTER,
  forceTLS: true,
});
