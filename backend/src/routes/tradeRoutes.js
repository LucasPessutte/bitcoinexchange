import express from 'express';
import { authenticate } from '../middlewares/authMiddlewares.js';
import { getRecentTrades } from '../controllers/tradeController.js';

const router = express.Router();

router.get('/recent', authenticate, getRecentTrades);

export default router;
