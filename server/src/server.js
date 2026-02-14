import 'dotenv/config'; // Charge le .env automatiquement
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import { setupSignaling } from './sockets/signaling.js';
import { SOCKET_EVENTS } from '../shared/constants.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`${socket.id}: connecté `);
  
  socket.on('disconnect', () => {
    console.log(` ${socket.id}: déconnecté `);
    const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    rooms.forEach(roomId => {
      socket.to(roomId).emit(SOCKET_EVENTS.USER_DISCONNECTED, { socketId: socket.id });
    });

  });
});

setupSignaling(io); // Configure les événements de signaling pour WebRTC

server.listen(PORT, '0.0.0.0', () => { // On force l'écoute sur 0.0.0.0 pour Docker
  console.log(` Serveur démarré sur le port ${PORT}`);
});