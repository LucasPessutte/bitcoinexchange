import sequelize from './config/database.js';
import {redisClient} from './config/redis.js';
import { startMatchingWorker } from './workers/matchingWorker.js';

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log('🛢️ Banco conectado para o Worker');

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    console.log('📡 Redis conectado para o Worker');

    console.log('⚙️ Iniciando Matching Worker...');
    await startMatchingWorker();
  } catch (err) {
    console.error('❌ Erro ao iniciar o Worker:', err);
    process.exit(1);
  }
}

bootstrap();