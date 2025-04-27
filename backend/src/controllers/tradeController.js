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
