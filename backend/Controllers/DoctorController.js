import Doctor from "../model/DoctorSchema.js";
import { format } from "date-fns";
import bcrypt from "bcryptjs";
import generateOTP from "../utils/generateOtp.js";
import generateMail from "../utils/generateMail.js";
import Booking from "../model/bookingSchema.js";
import bookingSchema from "../model/bookingSchema.js";
import User from "../model/UserSchema.js";
import { v4 as uuidv4 } from "uuid";
import ChatMessage from "../model/chatMessage.js";

export const DoctorForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      res.status(400).json({ success: false, message: "Invalid user" });
    }
    if (doctor.isBlocked) {
      res.status(401).json({ success: false, message: "Doctor is Bolocked" });
      return;
    }

    const verificationCode = generateOTP();
    const status = await generateMail(verificationCode, doctor.email);
    console.log(status, "status");
    if (status.success) {
      doctor.verificationCode = verificationCode;
    }
    await doctor.save();
    console.log(doctor, "doctor");

    res.status(200).json({
      message: "Verification OTP sended to email",
      doctorData: {
        name: doctor._doc.name,
        email: doctor._doc.email,
      },
    });
  } catch (error) {
    console.log(error.message, "error");
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPasswordOtpVerify = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    console.log(email, "email  ");
    const doctor = await Doctor.findOne({ email, verificationCode });
    if (!doctor) {
      res.status(404).json({ status: false, message: "User not found" });
    }
    doctor.isVerified = true;
    await doctor.save();

    return res.status(200).json({
      message: "Otp verified successfully",
      email: doctor.email,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    res.status(400);
    throw new Error("Invalid user");
  }

  const verificationCode = generateOTP();
  const status = await generateMail(verificationCode, doctor.email);
  console.log(status);

  if (status.success) {
    doctor.verificationCode = verificationCode;
    console.log(doctor, "doctor after setting verification Code");
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Otp Resend Successfully please check email for the OTP",
    });
  } else if (!status?.success) {
    res.status(500);
    throw new Error("Server is temporarly Unavaliable");
  }
};

export const DoctorResetPassword = async (req, res) => {
  const { email, password } = req.body;
  const doctor = await Doctor.findOne({ email });
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  if (doctor) {
    doctor.password = hashPassword;
    await doctor.save();

    res.status(200).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
    });
  } else {
    res
      .status(404)
      .json({ success: true, message: "Cant able to reset Password" });
  }
};

export const changeDoctorPassword = async (req, res) => {
  console.log(req.body, "req.body");
  const { currentPassword, newPassword, confirmPassword, email } = req.body;

  try {
    const user = await Doctor.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }

    //for check if the currentPassword matches the user's password

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid current Password" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "new Password and confirm Password do not Match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirmPassword, salt);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDoctor = async (req, res) => {
  console.log(req.body, "reqbody");

  // console.log(req.body.data.certificate, "certificates");
  const id = req.params.id;

  let certificates = [];
  const certificateFiles = req.body.certificates;

  if (certificateFiles?.length > 0) {
    certificates = certificateFiles.map((file) => ({ url: file }));
  } else {
    const exisitingDoctor = await Doctor.findById(id);
    certificates = exisitingDoctor.certificate;
  }

  const updateData = { ...req.body };

  try {
    const updateDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    console.log(updateDoctor, "update Doctorrr");
    const { password, ...rest } = updateDoctor._doc;
    const existingToken = req.headers.authorization.split(" ")[1];
    console.log(existingToken);

    res.status(200).json({
      status: true,
      message: "Successfully Updated",
      data: { ...rest, token: existingToken },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Failed to update" });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteDoctor = await Doctor.findByIdAnddelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      data: deleteDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const doctor = await Doctor.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "No Doctor Found" });
    console.log(error);
  }
};

export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;

    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "true",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "true" }).select("-password");
    }
    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Not found" });
  }
};

/////adding time slots //////

export const addTimeSlots = async (req, res) => {
  const docId = req.userId;

  console.log(req.body, "req.body......");
  try {
    const doctor = await Doctor.findOne({ _id: docId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { date, slots } = req.body.data;
    const indianDate = format(new Date(date), "dd/MM/yyyy");

    const timeSchedule = {
      uniDate: date,
      indianDate: indianDate,
      slots: slots,
    };

    const existingSlotIndex = doctor.timeSlots.findIndex((slot) => {
      return slot.indianDate === timeSchedule.indianDate;
    });

    if (existingSlotIndex !== -1) {
      // console.log("exist");
      // console.log(doctor.timeSlots[existingSlotIndex].slots);
      slots.forEach((slot) => {
        doctor.timeSlots[existingSlotIndex].slots.push(slot);
      });
    } else {
      if (doctor.timeSlots) {
        doctor.timeSlots.push(timeSchedule);
      } else {
        doctor.timeSlots = [timeSchedule];
      }
    }

    await doctor.save();

    return res.status(200).json({ message: "Time slotss added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding time slots" });
  }
};

//// getting available Dates ////

export const getAvailableDates = async (req, res) => {
  const docId = req.userId;

  try {
    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const dates = doctor.timeSlots.map((timeSlot) => timeSlot.uniDate);

    res.status(200).json({ data: dates });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAvailableSlots = async (req, res) => {
  const docId = req.userId;
  const date = req.params.date;
  const indianDate = format(new Date(date), "dd/MM/yyyy");

  try {
    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const timeSlots = doctor.timeSlots.find(
      (slot) => slot.indianDate == indianDate
    );

    console.log(timeSlots, "timeSolotss");

    if (!timeSlots) {
      return res
        .status(404)
        .json({ message: "Time slot not found for the speci" });
    }
    const slots = timeSlots.slots;

    return res.status(200).json({ message: "Time slotes Found", data: slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeSlots = async (req, res) => {
  const docId = req.userId;
  const date = req.query.selectedDate;
  const indianDate = format(new Date(date), "dd/MM/yyyy");
  const slot = req.query.slot;
  console.log(slot, "slottt");

  try {
    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const filter = {
      _id: docId,
      "timeSlots.indianDate": indianDate,
    };

    const update = {
      $pull: {
        "timeSlots.$.slots": slot,
      },
    };

    const result = await Doctor.updateOne(filter, update);
    await Doctor.updateOne(
      { _id: docId },
      { $pull: { timeSlots: { slots: [] } } }
    );

    if (result.Modified === 1) {
      console.log("result", result);
      return res.status(200).json({ message: "Slot removed successfully" });
    } else {
      return res.status(404).json({ message: "Slot not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error removing slot", error });
  }
};

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });
    res.status(200).json({
      sucess: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

///// get Appointments //////

export const getAppointments = async (req, res) => {
  const doctorId = req.userId;

  try {
    const bookings = await Booking.find(
      { "doctor._id": doctorId },
      {
        "patient.name": 1,
        "patient.photo": 1,
        "patient._id": 1,
        IndianDate: 1,
        slot: 1,
        isCancelled: 1,
      }
    ).sort({ AppointmentDate: -1 });

    if (bookings.length === 0) {
      throw new Error("Oops! you did't have any appointments yet");
    }
    res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: bookings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
        ? error.message
        : "Something went Wrong, cannot get Appointments",
    });
  }
};

//// Approve VideoCall /////

export const approveVideoCall = async (req, res) => {
  const PatientId = req.params.id;
  console.log(PatientId, "from approveVideoCall");
  const status = req.query.status;
  console.log(status, "status");

  try {
    const changeStatus = await User.findByIdAndUpdate(
      PatientId,
      { $set: { VideoCallApprove: status } },
      { new: true }
    );

    console.log(changeStatus, "status Changes");

    if (!changeStatus) {
      return res.status(404).json({ message: "User not found" });
    }
    const roomId = `${uuidv4()}-${PatientId}`;
    const doctor = await Doctor.findOne();
    res
      .status(200)
      .json({ status: true, message: "User status changed", roomId });
  } catch (error) {
    res.status(500).json({ status: false, message: "Change status failed " });
  }
};

////////Cancell Appointment /////////

export const CancellAppointment = async (req, res) => {
  const bookingId = req.params.id;
  let booking = await Booking.findById(bookingId);
  console.log(booking, "Booking");
  try {
    const cancel = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { isCancelled: true } },
      { new: true }
    );

    if (!cancel) {
      return res.status(404).json({ message: "Booking Not found" });
    }
    res.status(200).json({ success: true, message: "AppointmentCancelled " });
  } catch (error) {
    res
      .status(500)
      .json({ status: true, message: "Booking cancellation failed" });
  }
};

///// Marking message As Read ///

export const MarkMessageAsRead = async (req, res) => {
  const roomId = req.params.id;

  try {
    const messages = await ChatMessage.find({ room: roomId });

    await Promise.all(
      messages.map(async (message) => {
        (message.read = true), await message.save();
      })
    );
  } catch (error) {
    console.log("Error finding messages ", error);

    res.status(500).json({
      success: false,
      message: "An error occured while finding the messages",
    });
  }
};
