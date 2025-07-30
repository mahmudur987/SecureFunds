import mongoose from "mongoose";
import { TransactionStatus, TransactionType } from "./transaction.interface";

export const transactionSchema = new mongoose.Schema<Transaction>(
  {
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    transactionStatus: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.pending,
    },
    description: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TransactionModel = mongoose.model<Transaction>(
  "Transaction",
  transactionSchema
);
