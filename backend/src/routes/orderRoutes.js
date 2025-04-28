import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddlewares.js';
import { buyOrder, sellOrder, cancelOrder, getActivesOrders, getOrderBook } from '../controllers/orderController.js';

const router = Router();

router.post('/buy', authenticate, buyOrder);
router.get('/active', authenticate, getActivesOrders);
router.get('/orderbook', authenticate, getOrderBook);
router.post('/sell', authenticate, sellOrder);
router.delete('/cancel/:id', authenticate, cancelOrder);

export default router;