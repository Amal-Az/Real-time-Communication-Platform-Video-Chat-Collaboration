import { io } from 'socket.io-client';

// L'URL de mon backend dockerisé
const SOCKET_URL =  'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // On connectera manuellement 
});

// Petit utilitaire pour logger les erreurs de socket
socket.on('connect_error', (err) => {
  console.error('Erreur de connexion Socket:', err.message);
});