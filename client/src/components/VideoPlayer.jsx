import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, muted = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted} // On se mute soi-même pour éviter l'écho
      style={{ width: '300px', borderRadius: '10px', background: '#222' }}
    />
  );
};

export default VideoPlayer;