import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, muted = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    
    // Si on n'a pas d'élément vidéo ou pas de flux, on ne fait rien
    if (!videoElement || !stream) return;

    // ÉVITE L'ABORT ERROR : 
    // On n'assigne le stream que s'il est différent de celui déjà présent
    if (videoElement.srcObject !== stream) {
      console.log("[VideoPlayer] Assignation d'un nouveau flux média");
      videoElement.srcObject = stream;
    }

    // Gestion de la lecture automatique
    const playVideo = async () => {
      try {
        if (videoElement.paused) {
          await videoElement.play();
        }
      } catch (err) {
        // Cette erreur arrive souvent si l'utilisateur n'a pas encore cliqué sur la page
        console.warn("[VideoPlayer] Lecture automatique bloquée ou interrompue :", err);
      }
    };

    playVideo();
  }, [stream]); // On ne réagit que si le stream change

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted} // pour éviter l'écho
      style={{ 
        width: '300px', 
        height: '225px', 
        borderRadius: '12px', 
        background: '#1a1a1a', 
        objectFit: 'cover', // Pour un rendu "Zoom style" sans bandes noires
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        border: '2px solid #333'
      }}
    />
  );
};

export default VideoPlayer;