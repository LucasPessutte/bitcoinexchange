import db from "../models/index.js";

const TradeModel = db.Trade;

export const getRecentTrades = async (req, res, next) => {
  try {
    const trades = await TradeModel.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50, // Search the last fifity trades
    });

    return res.json(trades);
  } catch (error) {
    next(error);
  }
};

export const getMyTradeHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const trades = await db.Trade.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { buyer_id: userId },
          { seller_id: userId }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    return res.json(trades);
  } catch (error) {
    next(error);
  }
};

