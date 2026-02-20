import React, { useState, useEffect } from 'react';
import { socket } from './services/socket';
import { SOCKET_EVENTS } from '@shared/constants'; 
import { useMediaStream } from './hooks/useMediaStream'; 
import VideoPlayer from './components/VideoPlayer';   

function App() {
  const [isJoined, setIsJoined] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', roomName: '' });
  const [stream, startStream] = useMediaStream(); 

  useEffect(() => {
    socket.on(SOCKET_EVENTS.ROOM_JOINED, (data) => {
      console.log('Succès ! Connecté à la salle :', data);
      setIsJoined(true);
    });

    socket.on('connect', () => {
      console.log('Socket connecté :', socket.id);
    });

    return () => {
      socket.off(SOCKET_EVENTS.ROOM_JOINED);
      socket.off('connect');
    };
  }, []);

  const handleJoin = async () => {
    if (userInfo.username && userInfo.roomName) {
      console.log('[App] handleJoin: demande de démarrage du stream...');
      try {
        await startStream();
        console.log('[App] handleJoin: stream démarré, connexion socket...');
        if (!socket.connected) socket.connect();

        // Émettre la demande de jointure dès que la socket est connectée
        if (socket.connected) {
          console.log('[App] handleJoin: socket déjà connectée, émission JOIN_ROOM');
          socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
            username: userInfo.username,
            roomName: userInfo.roomName
          });
        } else {
          console.log('[App] handleJoin: en attente de connexion socket...');
          socket.once('connect', () => {
            console.log('[App] handleJoin: socket connectée, émission JOIN_ROOM');
            socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
              username: userInfo.username,
              roomName: userInfo.roomName
            });
          });
        }
      } catch (err) {
        console.error('[App] handleJoin: erreur lors du démarrage du stream', err);
        alert('Erreur : ' + (err?.message || 'impossible d\'accéder à la caméra'));
      }
    } else {
      alert("Remplis tous les champs !");
    }
  };

  // VUE 1 : FORMULAIRE
  if (!isJoined) {
    return (
    <div style={{ textAlign: 'center', marginTop: '20px', color: 'white', background: '#121212', minHeight: '100vh', padding: '20px' }}>
      <h2 style={{ marginBottom: '10px' }}>Salle : <span style={{ color: '#00d1b2' }}>{userInfo.roomName}</span></h2>
      <p>Utilisateur : <strong>{userInfo.username}</strong></p>
    
      <div id="video-grid" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <div style={{ position: 'relative' }}>
          <p style={{ marginBottom: '5px' }}>Moi (Local)</p>
          {stream ? (
            <VideoPlayer stream={stream} muted={true} />
          ) : (
            <div style={{ width: '300px', height: '225px', background: '#333', display:'flex', alignItems:'center', justifyContent:'center', borderRadius: '12px' }}>
               <p>Initialisation caméra...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  }
  
  // VUE 2 : LA SALLE DE VISIO
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Salle : {userInfo.roomName}</h2>
      <p>Connecté en tant que <strong>{userInfo.username}</strong></p>
    
      <div id="video-grid" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <p>Moi (Local)</p>
          {stream ? (
            <VideoPlayer stream={stream} muted={true} />
          ) : (
            <div style={{ width: '300px', height: '225px', background: '#333', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>
               Chargement caméra...
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default App;