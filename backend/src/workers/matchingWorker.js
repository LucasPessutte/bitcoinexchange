// src/workers/matchingWorker.js
import { getNextOrderFromQueue } from '../services/queueService.js';

import sequelize from '../config/database.js';
import { models } from '../models/index.js';

const UserModel = models.User;
const OrderModel = models.Order;
const TradeModel = models.Trade;

// Função para processar a fila de ordens
async function processOrder(orderData) {
  const t = await sequelize.transaction(); // Controlar tudo com transação

  try {
    const { id, user_id, type, price, amount } = orderData;

    const user = await UserModel.findByPk(user_id, { transaction: t });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Encontrar ordens opostas para casar
    const oppositeType = type === 'buy' ? 'sell' : 'buy';

    // Buscar as ordens abertas do tipo oposto, ordenadas pelo melhor preço
    const matchingOrders = await OrderModel.findAll({
      where: {
        type: oppositeType,
        status: 'open',
        price: type === 'buy' ? { [sequelize.Op.lte]: price } : { [sequelize.Op.gte]: price },
      },
      order: [['price', type === 'buy' ? 'asc' : 'desc']], // Melhor preço primeiro
      transaction: t,
    });

    let remainingAmount = amount;

    for (const match of matchingOrders) {
      if (remainingAmount <= 0) break;

      const matchAmount = Math.min(remainingAmount, match.amount);
      const executionPrice = match.price;

      // Atualizar saldos
      const taker = user; // Quem mandou a ordem agora
      const maker = await UserModel.findByPk(match.user_id, { transaction: t });

      if (type === 'buy') {
        // Taker quer comprar BTC -> precisa ter saldo USD
        if (taker.usd_balance < matchAmount * executionPrice) {
          throw new Error('Saldo insuficiente para compra');
        }
        taker.btc_balance += matchAmount * (1 - 0.003); // Taker recebe BTC - 0.3% fee
        taker.usd_balance -= matchAmount * executionPrice;

        maker.btc_balance -= matchAmount;
        maker.usd_balance += (matchAmount * executionPrice) * (1 - 0.005); // Maker recebe USD - 0.5% fee
      } else {
        // Taker quer vender BTC -> precisa ter saldo BTC
        if (taker.btc_balance < matchAmount) {
          throw new Error('Saldo insuficiente para venda');
        }
        taker.btc_balance -= matchAmount;
        taker.usd_balance += (matchAmount * executionPrice) * (1 - 0.003); // Taker recebe USD - 0.3% fee

        maker.usd_balance -= matchAmount * executionPrice;
        maker.btc_balance += matchAmount * (1 - 0.005); // Maker recebe BTC - 0.5% fee
      }

      await taker.save({ transaction: t });
      await maker.save({ transaction: t });

      // Registrar o Trade
      await TradeModel.create({
        buyer_id: type === 'buy' ? taker.id : maker.id,
        seller_id: type === 'buy' ? maker.id : taker.id,
        price: executionPrice,
        amount: matchAmount,
      }, { transaction: t });

      // Atualizar a ordem matchada
      match.amount -= matchAmount;
      if (match.amount <= 0) {
        match.status = 'matched';
      }
      await match.save({ transaction: t });

      remainingAmount -= matchAmount;
    }

    // Atualizar a ordem original
    if (remainingAmount > 0) {
      const originalOrder = await OrderModel.findByPk(id, { transaction: t });
      originalOrder.amount = remainingAmount;
      originalOrder.status = 'open';
      await originalOrder.save({ transaction: t });
    } else {
      const originalOrder = await OrderModel.findByPk(id, { transaction: t });
      originalOrder.status = 'matched';
      originalOrder.amount = 0;
      await originalOrder.save({ transaction: t });
    }

    await t.commit();
    console.log(`✅ Ordem ${id} processada com sucesso.`);
  } catch (error) {
    console.error('Erro ao processar ordem:', error);
    await t.rollback();
  }
}

// Loop infinito para consumir a fila
async function startMatchingWorker() {
  console.log('🚀 Matching Worker iniciado...');
  while (true) {
    try {
      const nextOrder = await getNextOrderFromQueue();

      if (nextOrder) {
        await processOrder(nextOrder);
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Erro no Matching Worker:', error);
    }
  }
}

startMatchingWorker();
