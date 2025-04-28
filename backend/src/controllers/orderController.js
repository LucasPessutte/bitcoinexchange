// src/controllers/orderController.js
import { addOrderToQueue } from '../services/queueService.js';
import db from '../models/index.js';
import { getSocket } from '../services/socket.js';
import jwt from 'jsonwebtoken'; 

const OrderModel = db.Order;
const UserModel = db.User;

export const buyOrder = async (req, res, next) => {
  try {
    const { price, amount } = req.body;

    if (!price || !amount) {
      return res.status(400).json({ message: 'Price and amount are required.' });
    }

    const user = await UserModel.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 🛡️ Check existing open BUY orders
    const openBuyOrders = await OrderModel.sum('amount', {
      where: {
        user_id: req.user.id,
        type: 'buy',
        status: 'open'
      }
    });

    const reservedUsd = (openBuyOrders || 0) * price;
    const availableUsd = user.usd_balance - reservedUsd;
    const totalCost = amount * price;

    if (availableUsd < totalCost) {
      return res.status(400).json({ message: 'Insufficient available USD balance.' });
    }

    const newOrder = await OrderModel.create({
      user_id: req.user.id,
      type: 'buy',
      price,
      amount,
      status: 'open',
    });

    console.log('veio ate aqui')
    await addOrderToQueue(newOrder); 

    return res.status(201).json({ message: 'Purchase order submitted successfully.', order: newOrder });
  } catch (error) {
    next(error);
  }
};

export const sellOrder = async (req, res, next) => {
  try {
    const { price, amount } = req.body;

    if (!price || !amount) {
      return res.status(400).json({ message: 'Price and amount are required.' });
    }

    const user = await UserModel.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 🛡️ Check existing open SELL orders
    const openSellOrders = await OrderModel.sum('amount', {
      where: {
        user_id: req.user.id,
        type: 'sell',
        status: 'open'
      }
    });

    const reservedBtc = openSellOrders || 0;
    const availableBtc = user.btc_balance - reservedBtc;

    if (availableBtc < amount) {
      return res.status(400).json({ message: 'Insufficient available BTC balance.' });
    }

    const newOrder = await OrderModel.create({
      user_id: req.user.id,
      type: 'sell',
      price,
      amount,
      status: 'open',
    });

    await addOrderToQueue(newOrder); 

    return res.status(201).json({ message: 'Sell order submitted successfully.', order: newOrder });
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
      return res.status(404).json({ message: 'Order not found or already processed.' });
    }

    order.status = 'cancelled';
    await order.save();

    const io = getSocket();
    io.emit('orderCancelled', { orderId: order.id, userId: order.user_id });

    return res.status(200).json({ message: 'Order cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getActivesOrders = async (req, res, next) => {
  try {
    const user = req.user;

    const orders = await OrderModel.findAll({
      where: { user_id: user.id, status: 'open' }
    });

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
