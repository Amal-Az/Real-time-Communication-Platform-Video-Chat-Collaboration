import React, { useState, useEffect } from 'react';
import { socket } from './services/socket';
import { SOCKET_EVENTS } from '@shared/constants'; 
import { useMediaStream } from './hooks/useMediaStream'; 
import VideoPlayer from './components/VideoPlayer';   

function App() {
  const [isJoined, setIsJoined] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', roomName: '' });
  const stream = useMediaStream(); 

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

  const handleJoin = () => {
    if (userInfo.username && userInfo.roomName) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.once('connect', () => {
        socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
          username: userInfo.username,
          roomName: userInfo.roomName
        });
      });

      if (socket.connected) {
        socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
          username: userInfo.username,
          roomName: userInfo.roomName
        });
      }
    } else {
      alert("Remplis tous les champs !");
    }
  };

  // VUE 1 : FORMULAIRE
  if (!isJoined) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', margin: '100px auto' }}>
        <h1>DULFI Video</h1>
        <input 
          placeholder="Ton pseudo" 
          value={userInfo.username}
          onChange={e => setUserInfo({...userInfo, username: e.target.value})}
        />
        <input 
          placeholder="Nom de la salle" 
          value={userInfo.roomName}
          onChange={e => setUserInfo({...userInfo, roomName: e.target.value})}
        />
        <button onClick={handleJoin} style={{ padding: '10px', cursor: 'pointer' }}>
          Rejoindre la réunion
        </button>
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