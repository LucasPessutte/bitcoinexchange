// src/routes/orderRoutes.js
import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddlewares.js';
import { buyOrder, sellOrder, cancelOrder } from '../controllers/orderController.js';

const router = Router();

// Rotas de ordens protegidas por autenticação
router.post('/buy', authenticate, buyOrder);    // Comprar BTC usando USD
router.post('/sell', authenticate, sellOrder);  // Vender BTC para receber USD
router.delete('/cancel/:id', authenticate, cancelOrder); // Cancelar uma ordem ativa

export default router;