import { Types } from "mongoose";

export enum WalletStatus {
  "APPROVED" = "APPROVED",
  "SUSPENDED" = "SUSPENDED",
  "BLOCKED" = "BLOCKED",
  "PENDING" = "PENDING",
}

export interface IWallet {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  balance: number;
  status?: WalletStatus;
}
