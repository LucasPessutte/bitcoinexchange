import { Op } from 'sequelize';
import db from '../models/index.js';

const TradeModel = db.Trade;

// Função para buscar estatísticas
export const getStatistics = async (req, res, next) => {
  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    // Último preço
    const lastTrade = await TradeModel.findOne({
      order: [['createdAt', 'DESC']],
    });

    // Volume BTC e USD nas últimas 24h
    const tradesLast24h = await TradeModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: yesterday,
        },
      },
    });

    let btcVolume = 0;
    let usdVolume = 0;
    let prices = [];

    for (const trade of tradesLast24h) {
      btcVolume += trade.amount;
      usdVolume += trade.amount * trade.price;
      prices.push(trade.price);
    }

    const response = {
      lastPrice: lastTrade ? lastTrade.price : 0,
      btcVolume: btcVolume.toFixed(4),
      usdVolume: usdVolume.toFixed(2),
      high: prices.length ? Math.max(...prices) : 0,
      low: prices.length ? Math.min(...prices) : 0,
    };

    return res.json(response);
  } catch (error) {
    next(error);
  }
};