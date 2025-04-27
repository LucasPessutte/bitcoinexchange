// src/services/queueService.js
import redis from '../config/redis.js';

// Nome da fila no Redis
const ORDER_QUEUE_KEY = 'order-queue';

export const addOrderToQueue = async (order) => {
  try {
    await redis.rPush(ORDER_QUEUE_KEY, JSON.stringify({
      id: order.id,
      user_id: order.user_id,
      type: order.type,
      price: order.price,
      amount: order.amount,
      createdAt: order.createdAt,
    }));
    console.log(`📥 Ordem adicionada na fila: ${order.id}`);
  } catch (error) {
    console.error('Erro ao adicionar ordem na fila:', error);
    throw error;
  }
};

export const getNextOrderFromQueue = async () => {
  try {
    const data = await redis.lPop(ORDER_QUEUE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Erro ao ler ordem da fila:', error);
    throw error;
  }
};
