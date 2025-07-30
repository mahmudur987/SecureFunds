import { model, Schema, Types } from "mongoose";
import { IWallet } from "./wallet.interface";

export const walletSchema = new Schema<IWallet>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, require: true, default: 0 },
    isBlocked: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
