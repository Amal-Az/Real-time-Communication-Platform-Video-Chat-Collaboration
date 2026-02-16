import { useState, useEffect } from 'react';

export function useMediaStream() {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
      } catch (err) {
        console.error("Erreur accès média :", err);
        alert("Impossible d'accéder à la caméra. Vérifie les autorisations !");
      }
    }

    enableStream();

    // On coupe la caméra si le composant est détruit
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return stream;
}