import React, { useEffect, useRef } from 'react';
import styles from './Participant.module.scss';

const Participant: React.FC<{
  stream: MediaStream;
  muted?: boolean;
}> = ({ stream, muted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current!.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={styles.participant}>
      <video ref={videoRef} autoPlay muted={muted} />
    </div>
  );
};

export default Participant;
