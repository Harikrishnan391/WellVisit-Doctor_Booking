import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  number: { type: Number },
  phone: { type: Number },
  photo: { type: String },
  address: { type: String },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "patient",
  },
  isVerified: { type: Boolean, default: false },
  gender: { type: String, enum: ["male", "female", "other"] },
  bloodType: { type: String },
  isBlocked: { type: Boolean, default: false },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
  verificationCode: { type: String },
  VideoCallApprove: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", UserSchema);
