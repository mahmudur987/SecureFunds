/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
export enum paymentStatus {
  "PAID" = "PAID",
  "UNPAID" = "UNPAID",
  "CANCELLED" = "CANCELED",
  "FAILED" = "FAILED",
  "REFUNDED" = "REFUNDED",
}
export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGateway?: any;
  invoiceURL?: string;
  status: string;
}
