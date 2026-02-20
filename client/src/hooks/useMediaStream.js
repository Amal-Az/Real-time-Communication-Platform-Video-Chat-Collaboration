import { useState, useEffect, useRef, useCallback } from 'react';

export function useMediaStream() {
  const [stream, setStream] = useState(null);
  const currentStreamRef = useRef(null);

  const startStream = useCallback(async () => {
    console.log('[useMediaStream] startStream: vérification support navigator.mediaDevices...');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const err = new Error('getUserMedia non supporté ou contexte non sécurisé (HTTPS/localhost requis)');
      console.error('[useMediaStream] startStream:', err.message);
      throw err;
    }

    console.log('[useMediaStream] startStream: appel getUserMedia...');
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true 
      });
      console.log('[useMediaStream] startStream: flux obtenu', localStream);
      currentStreamRef.current = localStream;
      setStream(localStream);
      return localStream;
    } catch (err) {
      console.error('[useMediaStream] startStream: erreur getUserMedia', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    return () => {
      console.log('[useMediaStream] cleanup: arrêt du flux...');
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach(t => {
          console.log('[useMediaStream] cleanup: arrêt track', t.kind);
          t.stop();
        });
        currentStreamRef.current = null;
      }
    };
  }, []);

  return [stream, startStream];
}