import express from 'express';
import { authenticate } from '../middlewares/authMiddlewares.js';
import { getStatistics } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/', authenticate, getStatistics);

export default router;