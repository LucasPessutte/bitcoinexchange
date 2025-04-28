import { Server } from 'socket.io';

let ioInstance = null;

export function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: '*', // All access for development
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log('🧠 Novo cliente conectado via WebSocket:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Cliente desconectado:', socket.id);
    });
  });

  return ioInstance;
}

export function getSocket() {
  if (!ioInstance) {
    throw new Error('Socket.IO não inicializado. Você precisa chamar initSocket primeiro.');
  }
  return ioInstance;
}
