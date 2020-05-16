import React from 'react';
import { DataConnection } from 'peerjs';
import { IPeer } from '../services/firebase';
import peer from '../services/peer';
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
  initialState,
  loading,
}: {
  peers: Record<string, IPeer>;
  userId: string;
  initialState: IPeerStateData;
  loading: boolean;
}): [
  Record<string, IPeerState>,
  React.Dispatch<React.SetStateAction<IPeerStateData>>
] {
  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [selfState, setSelfState] = React.useState<IPeerStateData>(
    initialState
  );
  const [peerState, setPeerState] = React.useState<Record<string, IPeerState>>(
    {}
  );
  const prevSelfState = usePrevious<IPeerStateData>(selfState);

  React.useEffect(() => {
    if (!loading) {
      peer.on('connection', (connection: DataConnection) => {
        const { userId: peerUserId } = connection.metadata;

        connection.on('open', () => {
          connection.on('data', (data) => {
            setPeerState((prevState) => ({
              ...prevState,
              [peerUserId]: {
                connection,
                connected: true,
                data,
              },
            }));
          });

          // on connect, send self state
          connection.send(selfState);
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
  }, [loading, selfState]);

  React.useEffect(() => {
    if (peers && userId && !loading) {
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
  }, [peers, userId, loading, selfState, peerState, setPeerState]);

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

  // close all connections
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
    []
  );

  return [peerState, setSelfState];
}

export default usePeerState;
