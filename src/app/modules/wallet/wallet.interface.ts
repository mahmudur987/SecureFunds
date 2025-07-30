import { Types } from "mongoose";

export interface IWallet {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  balance: number;
  isBlocked?: boolean;
}
