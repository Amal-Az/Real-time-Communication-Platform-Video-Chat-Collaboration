import { SOCKET_EVENTS, WEBRTC_EVENTS } from '../../shared/constants.js';
import { RoomService } from '../services/room.service.js';

export const setupSignaling = (io) => {
  io.on('connection', (socket) => {
    
    //  Un seul écouteur pour la jointure
    socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({ roomName, username }) => {
      try {
        // 1. Persistance DB : On s'assure que la salle et l'user existent
        const room = await RoomService.findOrCreateRoom(roomName);
        const user = await RoomService.findOrCreateUser(username);

        // 2. rejoint le canal de communication
        socket.join(roomName);
        
        // On stocke le userId et le roomId dans le socket pour les futurs événements
        socket.userId = user.id;
        socket.dbRoomId = room.id;
        socket.username = username;

        console.log(` ${username} (ID:${user.id}) a rejoint ${roomName}`);

        // 3. informer les autres membres (en envoyant l'ID de la DB)
        socket.to(roomName).emit(SOCKET_EVENTS.USER_CONNECTED, { 
          username, 
          userId: user.id, 
          socketId: socket.id 
        });

        // 4. informer l'utilisateur qu'il est connecté
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, { 
         roomName, 
         username,
         userId: user.id 
       });

      } catch (error) {
        console.error("Erreur jointure salle:", error);
        socket.emit('error', 'Erreur serveur lors de la connexion à la salle');
      }
    });

    // --- RELAIS SIGNALING WEBRTC ---
    // On ne touche pas au contenu, on fait juste transiter les paquets
    socket.on(WEBRTC_EVENTS.OFFER, ({ offer, to, from }) => {
      io.to(to).emit(WEBRTC_EVENTS.OFFER, { offer, from });
    });
    
    socket.on(WEBRTC_EVENTS.ANSWER, ({ answer, to, from }) => {
      io.to(to).emit(WEBRTC_EVENTS.ANSWER, { answer, from });
    });

    socket.on(WEBRTC_EVENTS.CANDIDATE, ({ candidate, to, from }) => {
      io.to(to).emit(WEBRTC_EVENTS.CANDIDATE, { candidate, from });
    });

    socket.on('disconnect', () => {
      console.log(` Client déconnecté : ${socket.id} (${socket.username || 'Inconnu'})`);
    });
  });
};