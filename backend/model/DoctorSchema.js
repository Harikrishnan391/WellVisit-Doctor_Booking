import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: Number, required: true },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  degree: { type: String, required: true },
  certificate: { type: Array },
  fee: { type: Number },
  college: { type: String },
  photo: { type: String },
  ticketPrice: { type: Number },

  role: {
    type: String,
  },

  specialization: { type: String },
  qualification: {
    type: Array,
  },

  experience: {
    type: Array,
  },

  education: {
    type: Array,
  },

  bio: { type: String, maxLength: 500 },

  about: { type: String },
  timeSlots: { type: Array },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],

  averageRating: {
    type: Number,
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
  },

  isApproved: {
    type: Boolean,

    default: false,
  },

  certificateApprove: {
    type: Boolean,
    // enum: ["pending", "true", "false"],
    default: false,
  },

  VideoCallApprove: {
    type: Boolean,
    default: false,
  },
  about: { type: String },

  isBlocked: {
    type: Boolean,
    // enum: ["pending", "true", "false"],
    default: false,
  },

  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
  verificationCode: { type: String },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Doctor", DoctorSchema);
