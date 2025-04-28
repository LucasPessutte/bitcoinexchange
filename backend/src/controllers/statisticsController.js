import { Op } from 'sequelize';
import db from '../models/index.js';

const TradeModel = db.Trade;
const UserModel = db.User;

// Function to fetch statistics
export const getStatistics = async (req, res, next) => {
  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    // Last price
    const lastTrade = await TradeModel.findOne({
      order: [['createdAt', 'DESC']],
    });

    // BTC and USD volume in the last 24h
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


    const user = await UserModel.findOne({where: {id: req.user.id }});
    
    const response = {
      lastPrice: lastTrade ? lastTrade.price : 0,
      btcVolume: btcVolume.toFixed(4),
      usdVolume: usdVolume.toFixed(2),
      high: prices.length ? Math.max(...prices) : 0,
      low: prices.length ? Math.min(...prices) : 0,
      user_usd_balance: user.usd_balance,
      user_btc_balance: user.btc_balance
    };

    return res.json(response);
  } catch (error) {
    next(error);
  }
};