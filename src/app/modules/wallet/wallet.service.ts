import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

const getAllWallet = async () => {
  const wallet = await Wallet.find({}).populate(
    "userId",
    "name email phone role"
  );
  return { count: wallet.length, data: wallet };
};

const updateWallet = async (userId: string, data: Partial<IWallet>) => {
  const result = await Wallet.findOneAndUpdate({ userId }, data, {
    new: true,
  });

  return result;
};
export const walletService = { getAllWallet, updateWallet };
