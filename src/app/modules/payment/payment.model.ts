import { model, Schema } from "mongoose";
import { IPayment, paymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(paymentStatus),
    default: paymentStatus.UNPAID,
  },
  paymentGateway: {
    type: Schema.Types.Mixed,
  },
  invoiceURL: {
    type: String,
  },
});

export const Payment = model<IPayment>("Payment", paymentSchema);
