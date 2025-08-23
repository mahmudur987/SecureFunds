import BuildQuery from "../../utils/QueryBuilder";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

const getAllWallet = async (query: Record<string, string>) => {
  const { data, meta } = await BuildQuery(Wallet.find(), query, {
    searchFields: ["name", "description"],
  });

  return {
    data,
    meta,
  };
};

const updateWallet = async (userId: string, data: Partial<IWallet>) => {
  const result = await Wallet.findOneAndUpdate({ userId }, data, {
    new: true,
  });

  return result;
};
export const walletService = { getAllWallet, updateWallet };
