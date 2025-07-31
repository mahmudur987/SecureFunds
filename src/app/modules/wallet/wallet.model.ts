import { model, Schema } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";

export const walletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, require: true, default: 0 },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.PENDING,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
