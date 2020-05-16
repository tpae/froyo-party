import React from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { IPeer } from '../services/firebase';

interface ICall {
  call?: MediaConnection;
  stream?: MediaStream;
  connected: boolean;
}

function usePeerCalls({
  peers,
  userId,
  peer,
  sourceState,
  sourceStream,
  loading,
}: {
  peers: Record<string, IPeer>;
  userId: string;
  peer: Peer;
  sourceState: string;
  sourceStream?: MediaStream;
  loading: boolean;
}): Record<string, ICall> {
  const [calls, setCalls] = React.useState<Record<string, ICall>>({});

  // when a room first opens, dial all the participants.
  React.useEffect(() => {
    if (
      sourceState === 'resolved' &&
      sourceStream &&
      peer.id &&
      peers &&
      userId &&
      !loading
    ) {
      Object.keys(peers).forEach((peerUserId) => {
        if (!calls[peerUserId] && peerUserId !== userId) {
          const call = peer.call(peers[peerUserId].peerId, sourceStream, {
            metadata: {
              userId,
            },
          });

          // if user is connected
          call.on('stream', (connectedStream: MediaStream) => {
            setCalls((prevCalls) => ({
              ...prevCalls,
              [peerUserId]: {
                ...prevCalls[peerUserId],
                stream: connectedStream,
                connected: true,
              },
            }));
          });

          // if session is closed
          call.on('close', () => {
            setCalls((prevCalls) => {
              const { [peerUserId]: omitted, ...rest } = prevCalls;
              return rest;
            });
          });

          // if session has an error
          call.on('error', (err) => {
            console.log(err);
            setCalls((prevCalls) => {
              const { [peerUserId]: omitted, ...rest } = prevCalls;
              return rest;
            });
          });

          // initialize default
          setCalls((prevCalls) => ({
            ...prevCalls,
            [peerUserId]: {
              call,
              connected: false,
            },
          }));
        }
      });
    }
  }, [
    peers,
    calls,
    sourceState,
    sourceStream,
    userId,
    setCalls,
    peer,
    loading,
  ]);

  // instantiate a listeners to answer calls as they come in.
  React.useEffect(() => {
    if (sourceState === 'resolved' && peer.id && sourceStream && !loading) {
      peer.on('call', (call: MediaConnection) => {
        const { userId: peerUserId } = call.metadata;
        call.answer(sourceStream);

        // if session is open
        call.on('stream', (connectedStream: MediaStream) => {
          setCalls((prevCalls) => ({
            ...prevCalls,
            [peerUserId]: {
              call,
              stream: connectedStream,
              connected: true,
            },
          }));
        });

        // if session is closed
        call.on('close', () => {
          setCalls((prevCalls) => {
            const { [peerUserId]: omitted, ...rest } = prevCalls;
            return rest;
          });
        });

        // if session has an error
        call.on('error', (err) => {
          console.log(err);
          setCalls((prevCalls) => {
            const { [peerUserId]: omitted, ...rest } = prevCalls;
            return rest;
          });
        });
      });
    }
  }, [sourceState, sourceStream, setCalls, userId, peer, loading]);

  React.useEffect(
    () => () => {
      Object.keys(peer.connections).forEach((peerUserId) => {
        peer.connections[peerUserId]
          .filter((connection: MediaConnection) => connection.type === 'media')
          .forEach((connection: MediaConnection) => {
            connection.close();
          });
      });
    },
    [peer]
  );

  return calls;
}

export default usePeerCalls;
