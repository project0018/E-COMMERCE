import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createTransaction, getTransactions, updateTransactions } from '../controllers/transaction.controller.js';

const router = express.Router();

router.post('/createtransaction', verifyToken, createTransaction);
router.get('/gettransactions/:id', getTransactions);
router.put('/updatetransaction/:transactionId/:sellerId', verifyToken, updateTransactions);
export default router;