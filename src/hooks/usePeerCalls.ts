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
  mediaState,
  mediaStream,
  loading,
}: {
  peers: Record<string, IPeer>;
  userId: string;
  peer: Peer;
  mediaState: string;
  mediaStream: MediaStream;
  loading: boolean;
}): Record<string, ICall> {
  const [calls, setCalls] = React.useState<Record<string, ICall>>({});

  // when a room first opens, dial all the participants.
  React.useEffect(() => {
    if (
      mediaState === 'resolved'
      && mediaStream
      && peer.id
      && peers
      && userId
      && !loading
    ) {
      Object.keys(peers).forEach((peerUserId) => {
        if (!calls[peerUserId] && peerUserId !== userId) {
          const call = peer.call(
            peers[peerUserId].peerId,
            mediaStream,
            {
              metadata: {
                userId: peerUserId,
              },
            },
          );

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
  },
  [
    peers,
    calls,
    mediaState,
    mediaStream,
    userId,
    setCalls,
    peer.id,
    loading,
  ]);

  // instantiate a listeners to answer calls as they come in.
  React.useEffect(() => {
    if (
      mediaState === 'resolved'
      && peer.id
      && mediaStream
      && !loading
    ) {
      peer.on('call', (call: MediaConnection) => {
        const { userId: peerUserId } = call.metadata;
        call.answer(mediaStream);

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
  }, [
    mediaState,
    mediaStream,
    setCalls,
    userId,
    peer,
    loading,
  ]);

  return calls;
}

export default usePeerCalls;
