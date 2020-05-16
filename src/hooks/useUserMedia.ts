import { useDebugValue, useEffect, useState } from 'react';

function stopAndRemoveTrack(mediaStream: MediaStream) {
  return (track: MediaStreamTrack) => {
    track.stop();
    mediaStream.removeTrack(track);
  };
}

function stopMediaStream(mediaStream: MediaStream) {
  if (!mediaStream) {
    return;
  }

  mediaStream.getTracks().forEach(stopAndRemoveTrack(mediaStream));
}

function useUserMedia(constraints: MediaStreamConstraints) {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [error, setError] = useState();
  const [state, setState] = useState('pending');

  useDebugValue({ error, state, stream });

  useEffect(() => {
    let canceled = false;

    setState('pending');
    navigator.mediaDevices.getUserMedia(constraints).then(
      (userStream) => {
        if (!canceled) {
          setState('resolved');
          setStream(userStream);
        }
      },
      (streamError) => {
        if (!canceled) {
          setState('rejected');
          setError(streamError);
        }
      }
    );

    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => () => stream && stopMediaStream(stream), [stream]);

  return { error, state, stream };
}

export default useUserMedia;
