// src/server.js
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import sequelize from './config/database.js';
import redis from './config/redis.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { initSocket } from './services/socket.js';
import {startMatchingWorker} from './workers/matchingWorker.js';

const app = express();
const server = createServer(app);
const io = initSocket(server); 

startMatchingWorker();

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
