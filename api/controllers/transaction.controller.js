import Transaction from "../models/transaction.model.js";
import { errorHandler } from "../utils/error.js";

export const createTransaction = async (req, res, next) => {
    try {
        const { userId, sellerId, totalAmount } = req.body;

        if (!userId || !sellerId || !totalAmount) {
            return next(errorHandler(403, 'All fields are required'));
        }

        // Check if a transaction already exists for this user and seller
        const existingTransaction = await Transaction.findOne({ userId, sellerId });

        if (existingTransaction) {
            return res.status(200).json({
                success: true,
                message: "Transaction already exists",
                transaction: existingTransaction
            });
        }

        // Create a new transaction
        const newTransaction = new Transaction({
            userId,
            sellerId,
            totalAmount,
        });

        await newTransaction.save();
        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction: newTransaction
        });
    } catch (error) {
        next(error);
    }
};


export const getTransactions = async (req, res, next) => {
    try {
        const { id } = req.params; 

        const transactions = await Transaction.find({
            $or: [{ userId: id }, { sellerId: id }],
        });

        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};

export const updateTransactions = async (req, res, next) => {
    try {
        const { totalAmount, balanceAmount, paidAmount, date } = req.body;
        
        if (!req.user.id || req.user.id !== req.params.sellerId) {
            return next(errorHandler(403, "You are not allowed to update this transaction"));
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.transactionId,
            {
                totalAmount,
                balanceAmount,
                paidAmount,
                date,
            },
            { new: true }
        );

        res.status(200).json(updatedTransaction);
    } catch (error) {
        next(error);
    }
};
