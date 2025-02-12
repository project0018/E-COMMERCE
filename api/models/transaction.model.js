import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: false, // Ensure this is NOT unique
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: {
    type: String,
    required: true,
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
  },
}, { timestamps: true });

// Ensure MongoDB does NOT enforce uniqueness on userId
transactionSchema.index({ userId: 1 }, { unique: false });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
