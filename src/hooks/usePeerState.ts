import React from 'react';
import Peer, { DataConnection } from 'peerjs';
import { IPeer } from '../services/firebase';
import usePrevious from './usePrevious';

interface IPeerStateData {
  hasAudio: boolean;
  hasVideo: boolean;
}

interface IPeerState {
  connection?: DataConnection;
  connected: boolean;
  data?: IPeerStateData;
}

function usePeerState({
  peers,
  userId,
  peer,
  initialState,
  loading,
}: {
  peers: Record<string, IPeer>;
  userId: string;
  peer: Peer;
  initialState: IPeerStateData;
  loading: boolean;
}): [
  Record<string, IPeerState>,
  React.Dispatch<React.SetStateAction<IPeerStateData>>
] {
  const [selfState, setSelfState] = React.useState<IPeerStateData>(
    initialState
  );
  const [peerState, setPeerState] = React.useState<Record<string, IPeerState>>(
    {}
  );
  const prevSelfState = usePrevious<IPeerStateData>(selfState);

  React.useEffect(() => {
    if (peer.id && peers && userId && !loading) {
      Object.keys(peers).forEach((peerUserId) => {
        if (!peerState[peerUserId] && peerUserId !== userId) {
          const connection = peer.connect(peers[peerUserId].peerId, {
            metadata: {
              userId,
            },
          });

          // if user is connected
          connection.on('open', () => {
            setPeerState((prevState) => ({
              ...prevState,
              [peerUserId]: {
                ...prevState[peerUserId],
                connection,
                connected: true,
              },
            }));

            connection.on('data', (data) => {
              console.log('caller received data', data);
              setPeerState((prevState) => ({
                ...prevState,
                [peerUserId]: {
                  ...prevState[peerUserId],
                  data,
                },
              }));
            });

            // on connect, send self state
            connection.send(selfState);
          });

          // if connection is closed
          connection.on('close', () => {
            setPeerState((prevState) => {
              const { [peerUserId]: omitted, ...rest } = prevState;
              return rest;
            });
          });

          // if connection has an error
          connection.on('error', (err) => {
            console.log(err);
            setPeerState((prevState) => {
              const { [peerUserId]: omitted, ...rest } = prevState;
              return rest;
            });
          });

          // initialize default
          setPeerState((prevState) => ({
            ...prevState,
            [peerUserId]: {
              connection,
              connected: false,
            },
          }));
        }
      });
    }
  }, [peer, peers, userId, loading, selfState, peerState, setPeerState]);

  React.useEffect(() => {
    if (peer.id && !loading) {
      peer.on('connection', (connection: DataConnection) => {
        const { userId: peerUserId } = connection.metadata;

        connection.on('data', (data) => {
          console.log('receiver received data', data);
          setPeerState((prevState) => ({
            ...prevState,
            [peerUserId]: {
              connection,
              connected: true,
              data,
            },
          }));
        });

        connection.on('close', () => {
          setPeerState((prevState) => {
            const { [peerUserId]: omitted, ...rest } = prevState;
            return rest;
          });
        });

        // if connection has an error
        connection.on('error', (err) => {
          console.log(err);
          setPeerState((prevState) => {
            const { [peerUserId]: omitted, ...rest } = prevState;
            return rest;
          });
        });
      });
    }
  }, [peer, loading]);

  React.useEffect(() => {
    if (prevSelfState !== selfState) {
      Object.keys(peerState).forEach((peerUserId) => {
        if (
          peerState[peerUserId] &&
          peerState[peerUserId].connected &&
          peerState[peerUserId].connection &&
          peerState[peerUserId].connection!.open
        ) {
          peerState[peerUserId].connection!.send(selfState);
        }
      });
    }
  }, [selfState, prevSelfState, peerState]);

  React.useEffect(
    () => () => {
      Object.keys(peer.connections).forEach((peerUserId) => {
        peer.connections[peerUserId]
          .filter((connection: DataConnection) => connection.type === 'data')
          .forEach((connection: DataConnection) => {
            connection.close();
          });
      });
    },
    [peer]
  );

  return [peerState, setSelfState];
}

export default usePeerState;
