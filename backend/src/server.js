// src/server.js
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import sequelize from './config/database.js';
import redis from './config/redis.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // All access for development
  }
});

export { io };

// Middlewares Express
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/trades', tradeRoutes);

app.use(notFound);
app.use(errorHandler);

// Errors Middlewares
app.use(errorHandler);

// Socket.io Events
io.on('connection', (socket) => {
  console.log('🧠 Novo cliente conectado via WebSocket:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('🛢️ Banco conectado.');

    server.listen(PORT, () => {
      console.log(`⚡ Backend rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();
