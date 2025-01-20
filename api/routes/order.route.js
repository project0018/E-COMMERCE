import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createOrder, getOrders, updateOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createOrder);
router.get('/getOrders/:id', getOrders);
router.put('/updateOrder/:orderId/:sellerId', verifyToken, updateOrder);

export default router;
