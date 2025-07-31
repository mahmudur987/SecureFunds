import { Types } from "mongoose";

export enum TransactionType {
  "Send-Money" = "Send-Money",
  "CashIn" = "CashIn",
  "CashOut" = "CashOut",
  "Add-Money" = "Add-Money",
}
export enum TransactionStatus {
  "success" = "success",
  "pending" = "pending",
  "failed" = "failed",
}

export interface Transaction {
  transactionType: TransactionType;
  amount: number;
  fromUserId?: Types.ObjectId | null;
  toUserId?: Types.ObjectId;
  agentId?: Types.ObjectId | null;
  transactionStatus: TransactionStatus;
  description: string;
}
