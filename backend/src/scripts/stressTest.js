import { redisClient } from '../config/redis.js';
import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

const OrderModel = db.Order;

const TOTAL_MATCHES = 25;
const BASE_PRICE = 10000;
const PRICE_VARIATION = 100;
const USER_IDS = ['2bd8dd38-8315-4302-954b-7cdf77612227', 'f0e8d5a9-f6b1-4c05-9d58-f3b1c3fb0fef', '8f963bdd-9bfc-458a-b063-9209d1650ffc'];

function randomAmount(min = 0.001, max = 0.5) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(4));
}

function randomUser() {
  return USER_IDS[Math.floor(Math.random() * USER_IDS.length)];
}

async function sendMatchingOrders() {
  console.log(`🎯 Enviando ${TOTAL_MATCHES * 2} ordens casáveis para a fila...`);

  for (let i = 0; i < TOTAL_MATCHES; i++) {
    const price = BASE_PRICE + Math.floor(Math.random() * PRICE_VARIATION);
    const amount = randomAmount();

    const sellOrder = {
      id: uuidv4(),
      user_id: randomUser(),
      type: 'sell',
      price: price,
      amount: amount,
      status: 'open' // adiciona status
    };

    const buyOrder = {
      id: uuidv4(),
      user_id: randomUser(),
      type: 'buy',
      price: price + Math.floor(Math.random() * 10),
      amount: amount,
      status: 'open'
    };

    // Salva no banco ANTES de enviar para o Redis
    await OrderModel.create(sellOrder);
    await OrderModel.create(buyOrder);

    // Empurra pra fila
    await redisClient.lPush('order-queue', JSON.stringify(sellOrder));
    await redisClient.lPush('order-queue', JSON.stringify(buyOrder));

    console.log(`📥 Enviado: SELL ${sellOrder.amount} BTC @ ${sellOrder.price}`);
    console.log(`📥 Enviado: BUY ${buyOrder.amount} BTC @ ${buyOrder.price}`);
  }

  console.log('✅ Ordens casáveis enviadas e salvas no banco.');
  process.exit();
}

sendMatchingOrders();
