import React, { useEffect, useRef } from 'react';
import styles from './Participant.module.scss';

const Participant = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current!.srcObject = stream;
    }
  }, [videoRef.current]);

  return (
    <div className={styles.participant}>
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default Participant;
