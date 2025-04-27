// src/controllers/orderController.js
import { addOrderToQueue } from '../services/queueService.js';
import db from '../models/index.js';

const OrderModel = db.Order;

export const buyOrder = async (req, res, next) => {
  try {
    const { price, amount } = req.body;

    if (!price || !amount) {
      return res.status(400).json({ message: 'Preço e quantidade são obrigatórios.' });
    }

    const newOrder = await OrderModel.create({
      user_id: req.user.id,
      type: 'buy',
      price,
      amount,
    });

    await addOrderToQueue(newOrder); 

    return res.status(201).json({ message: 'Ordem de compra criada com sucesso.', order: newOrder });
  } catch (error) {
    next(error);
  }
};

export const sellOrder = async (req, res, next) => {
  try {
    const { price, amount } = req.body;

    if (!price || !amount) {
      return res.status(400).json({ message: 'Preço e quantidade são obrigatórios.' });
    }

    const newOrder = await OrderModel.create({
      user_id: req.user.id,
      type: 'sell',
      price,
      amount,
    });

    await addOrderToQueue(newOrder); 

    return res.status(201).json({ message: 'Ordem de venda criada com sucesso.', order: newOrder });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await OrderModel.findOne({
      where: { id, user_id: req.user.id, status: 'open' }
    });

    if (!order) {
      return res.status(404).json({ message: 'Ordem não encontrada ou já processada.' });
    }

    order.status = 'cancelled';
    await order.save();

    return res.status(200).json({ message: 'Ordem cancelada com sucesso.' });
  } catch (error) {
    next(error);
  }
};
