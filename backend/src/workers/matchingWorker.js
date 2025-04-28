// src/workers/matchingWorker.js
import { getNextOrderFromQueue } from '../services/queueService.js';
import sequelize from '../config/database.js';
import db from '../models/index.js';
import { Op } from 'sequelize';
import { getSocket } from '../services/socket.js';

const UserModel = db.User;
const OrderModel = db.Order;
const TradeModel = db.Trade;

// Função para processar a fila de ordens
export async function processOrder(orderData) {
  const t = await sequelize.transaction();

  try {
    const { id, user_id, type, price, amount } = orderData;
    const io = getSocket();

    const taker = await UserModel.findByPk(user_id, { transaction: t });
    if (!taker) {
      throw new Error('Usuário não encontrado');
    }

    const oppositeType = type === 'buy' ? 'sell' : 'buy';
    const matchingOrders = await OrderModel.findAll({
      where: {
        type: oppositeType,
        status: 'open',
        price: type === 'buy' ? { [Op.lte]: price } : { [Op.gte]: price },
        user_id: { [Op.ne]: taker.id }
      },
      order: [['price', type === 'buy' ? 'asc' : 'desc']],
      transaction: t,
    });


    let remainingAmount = amount;

    for (const match of matchingOrders) {
      if (remainingAmount <= 0) break;

      const matchAmount = Math.min(remainingAmount, match.amount);
      const executionPrice = match.price;

      const maker = await UserModel.findByPk(match.user_id, { transaction: t });
      if (!maker) {
        throw new Error('Usuário maker não encontrado');
      }

      const usdCost = matchAmount * executionPrice;
      const takerFee = usdCost * 0.003;
      const makerFee = usdCost * 0.005;

      if (type === 'buy') {
        if (taker.usd_balance < usdCost + takerFee) {
          throw new Error('Saldo USD insuficiente para compra');
        }

        taker.usd_balance -= (usdCost + takerFee);
        taker.btc_balance += matchAmount;

        maker.btc_balance -= matchAmount;
        maker.usd_balance += (usdCost - makerFee);

      } else { // type === 'sell'
        if (taker.btc_balance < matchAmount) {
          throw new Error('Saldo BTC insuficiente para venda');
        }

        taker.btc_balance -= matchAmount;
        taker.usd_balance += (usdCost - takerFee);

        maker.usd_balance -= (usdCost + makerFee);
        maker.btc_balance += matchAmount;
      }

      await taker.save({ transaction: t });
      await maker.save({ transaction: t });

      await TradeModel.create({
        buyer_id: type === 'buy' ? taker.id : maker.id,
        seller_id: type === 'buy' ? maker.id : taker.id,
        price: match.price,
        amount: matchAmount,
      }, { transaction: t });

      match.amount -= matchAmount;
      match.status = match.amount <= 0 ? 'matched' : 'open';
      await match.save({ transaction: t });

      remainingAmount -= matchAmount;

    }

    const originalOrder = await OrderModel.findByPk(id, { transaction: t });
    if (!originalOrder) {
      throw new Error('Ordem original não encontrada');
    }

    if (remainingAmount > 0) {
      originalOrder.amount = remainingAmount;
      originalOrder.status = 'open';
    } else {
      originalOrder.amount = 0;
      originalOrder.status = 'matched';
    }

    await originalOrder.save({ transaction: t });

    await t.commit();
    io.emit('statisticsUpdated');
    console.log(`✅ Ordem ${id} processada com sucesso.`);
  } catch (error) {
    console.error('Erro ao processar ordem:', error);
    await t.rollback();
  }
}

// Loop infinito para consumir a fila
export async function startMatchingWorker() {
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

