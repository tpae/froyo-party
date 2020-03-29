import React, { useState, useEffect, useRef } from 'react';

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState<any[]>([]);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const trackpubsToTracks = (trackMap: any) => Array.from(trackMap.values())
    .map((publication: any) => publication.track)
    .filter((track) => track !== null);

  const trackSubscribed = (track: any) => {
    if (track.kind === 'video') {
      setVideoTracks((vTracks) => [...vTracks, track]);
    } else {
      setAudioTracks((aTracks) => [...aTracks, track]);
    }
  };

  const trackUnsubscribed = (track: any) => {
    if (track.kind === 'video') {
      setVideoTracks((vTracks) => vTracks.filter((v) => v !== track));
    } else {
      setAudioTracks((aTracks) => aTracks.filter((a) => a !== track));
    }
  };

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
    }
    return () => {
      if (videoTrack) {
        videoTrack.detach();
      }
    };
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
    }
    return () => {
      if (audioTrack) {
        audioTrack.detach();
      }
    };
  }, [audioTracks]);

  return (
    <div className="participant">
      <video ref={videoRef} autoPlay />
      <audio ref={audioRef} autoPlay />
    </div>
  );
};

export default Participant;