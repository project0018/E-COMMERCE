import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    sellerId: {
        type: String,
        required: true,
        unique: true,
    },
    totalAmount: {
        type: String,
        default: "0",
    },
    balanceAmount: {
        type: String,
        default: "0",
    },
    paidAmount: { 
        type: String, 
        default: "0",
    },
    date: {
        type: String,
        default: "-",
    }
}, { timestamps: true });


const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;