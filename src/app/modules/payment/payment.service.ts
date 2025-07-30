/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHandler/AppError";
import { sslCommerzService } from "../../ssl_commerz/sslCommerz.service";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendmail } from "../../utils/sendEmail";
import { BookingStatus } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ITour } from "../tour/tour.interface";
import { IUSER } from "../user/user.interface";
import { paymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const { transactionId } = query;
  if (!transactionId) {
    throw new AppError(400, "Transaction ID is required");
  }

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findOneAndUpdate(
      { transactionId: transactionId },
      { status: paymentStatus.PAID }
    );

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      payment.booking, // booking field likely stores ObjectId
      { bookingStatus: BookingStatus.CONFIRMED },
      { new: true, runValidators: true, session }
    )
      .populate("tour")
      .populate("user");

    if (!updatedBooking) {
      throw new AppError(404, "Booking not found");
    }

    const invoiceData: IInvoiceData = {
      bookingDate: updatedBooking?.createdAt as Date,
      guestCount: updatedBooking.guestCount,
      totalAmount: payment.amount,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
      transactionId: payment.transactionId,
      userName: (updatedBooking.user as unknown as IUSER).name,
    };

    const pdfBuffer = await generatePdf(invoiceData);

    const cloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    );

    if (!cloudinaryResult) {
      throw new AppError(401, "Error uploading pdf");
    }

    await Payment.findByIdAndUpdate(
      payment._id,
      { invoiceUrl: cloudinaryResult.secure_url },
      { runValidators: true, session }
    );

    await sendmail({
      to: (updatedBooking.user as unknown as IUSER).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment successfully completed",
    };
  } catch (error) {
    console.error("Payment success processing failed:", error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failedPayment = async (query: Record<string, string>) => {
  const { transactionId } = query;
  if (!transactionId) {
    throw new AppError(400, "Transaction ID is required");
  }

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findOneAndUpdate(
      { transactionId: transactionId },
      { status: paymentStatus.FAILED }
    );

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      payment.booking, // booking field likely stores ObjectId
      { bookingStatus: BookingStatus.FAILED },
      { new: true, runValidators: true, session }
    );

    if (!updatedBooking) {
      throw new AppError(404, "Booking not found");
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment failed",
    };
  } catch (error) {
    console.error("Payment success processing failed:", error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelledPayment = async (query: Record<string, string>) => {
  const { transactionId } = query;
  if (!transactionId) {
    throw new AppError(400, "Transaction ID is required");
  }

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.findOneAndUpdate(
      { transactionId: transactionId },
      { status: paymentStatus.CANCELLED }
    );

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      payment.booking, // booking field likely stores ObjectId
      { bookingStatus: BookingStatus.CANCELLED },
      { runValidators: true, session }
    );

    if (!updatedBooking) {
      throw new AppError(404, "Booking not found");
    }

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment cancelled",
    };
  } catch (error) {
    console.error("Payment success processing failed:", error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) throw new AppError(404, "Payment not found");
  const booking = await Booking.findById(payment?.booking);
  const { email, phone, address, name } = booking?.user as any;

  const sslPayload: ISslCommerz = {
    address,
    amount: payment.amount,
    email,
    name,
    phone,
    transactionId: payment.transactionId,
  };
  const sslPayment = await sslCommerzService.sslPaymentInit(sslPayload);
  return {
    paymentUrl: sslPayment.GatewayPageURL,
    booking: booking,
  };
};
export const paymentServices = {
  successPayment,
  failedPayment,
  cancelledPayment,
  initPayment,
};
