import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: Object,
      ref: "Doctor",
    },

    patient: {
      type: Object,
      required: true,
    },
    fee: { type: Number, required: true },
    appointmentDate: {
      type: String,
      required: true,
    },
    IndianDate: {
      type: String,
      required: true,
    },
    slot: { type: String, required: true },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    cancelReason: {
      type: String,
    },
    paymentId: {
      required: true,
      type: String,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
