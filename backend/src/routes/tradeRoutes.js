import express from 'express';
import { authenticate } from '../middlewares/authMiddlewares.js';
import { getRecentTrades, getMyTradeHistory } from '../controllers/tradeController.js';

const router = express.Router();

router.get('/recent', authenticate, getRecentTrades);
router.get('/history', authenticate, getMyTradeHistory);

export default router;
