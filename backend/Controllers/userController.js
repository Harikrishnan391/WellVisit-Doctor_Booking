import User from "../model/UserSchema.js";
import Doctor from "../model/DoctorSchema.js";
import generateOTP from "../utils/generateOtp.js";
import Booking from "../model/bookingSchema.js"
import generateMail from "../utils/generateMail.js";
import bcrypt from "bcryptjs";
import generatePatientToken from "../jwt/patient/patientjwt.js";
import { format } from "date-fns";
import bookingSchema from "../model/bookingSchema.js";

export const updateUser = async (req, res) => {
  const id = req.userId;
  const { name, email, number, role, gender, bloodType,address } =
    req.body;
console.log(req.body,"req.body")
const pic = req.file?.filename;
console.log(pic,"picture")


  const updateData = {
    name,
    email,
    number,
    role,
    gender,
    bloodType,
    address,
    photo:pic

  };
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    console.log("updateUser", updateUser);

    res.status(200).json({ status: true, message: "successfully updated" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "failed to updated", data: updateUser });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteUser = await User.findByIdAnddelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      data: deleteUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

/**====================Forgot password================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user.isBlocked) {
      res.status(401);
      throw new Error({ success: false, message: "user is blocked" });
    }

    if (!user) {
      res.status(400);
      throw new Error({ success: false, message: "Invalid user " });
    }

    const verificationCode = generateOTP();
    console.log(verificationCode, "verification code ");
    const status = await generateMail(verificationCode, user.email);
    console.log(status);
    if (status.success) {
      user.verificationCode = verificationCode;
      await user.save();
      res.status(200).json({
        message: "Verification OTP sended to email",
        userData: {
          name: user._doc.name,
          email: user._doc.email,
        },
      });
    }
    console.log(user._doc.name, "usernameee");
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "server temeporarly Unavailable" });
  }
};

/*====================Reset Password Otp verify================================ */
export const resetPasswordOtpVerify = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });

    if (user.verificationCode !== verificationCode) {
      throw new Error("Otp is incorrect");
    }

    if (!user) {
      res.status(400);
      throw new Error({ success: false, message: "Invalid user Data" });
    }

    user.isVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Otp Verified successsfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "No user Found" });
  }
};

/**======================Reset password  User not Logged in ============================= */
export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, "Email of the user");
  const user = await User.findOne({ email });
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  if (user) {
    user.password = hashPassword;
    await user.save();
    // generatePatientToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
};

/***====================Change  Password  User is Logged IN============================ */

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword, email } = req.body;

  try {
    const user = await User.findOne({ email });

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

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "User found",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Not found" });
  }
};

/**==============Controller for User profile====================== */

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { password, ...rest } = user._doc;

    return res.status(200).json({
      success: true,
      message: "profile info getting",
      data: { ...rest },
    });
  } catch (error) {
    console.log("here have some problem", error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong ,cannot get " });
  }
};

export const getMyAppointments = async (req, res) => {
  const userId=req.userId
 
  try {

    const booking=await Booking.find(
      {"patient._id":userId},

      {
        "doctor.name":1,
        "doctor.specialization":1,
        "doctor.photo":1,
        indianDate:1,
        slot:1,
        isCancelled:1,
        cancelReason:1
      }
    ).sort({createdAt:-1})

    if(booking.length ===0){
      throw new Error("Oops ! you did't have any appointments yet!")
    }

    res.status(200).json({
      success:true,
      message:"Appointments are getting",
      data:booking
    })
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

/**==============get Available Slot======================== */

export const getAvailableSlots = async (req, res) => {
  const date = req.query.date;
  const docId = req.query.doctor;
  const indianDate = format(new Date(date), "dd/MM/yyyy");

  try {
    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor Not found" });
    }

    const timeSlot = doctor.timeSlots.find(
      (slot) => slot.indianDate == indianDate
    );
    if (!timeSlot) {
      return res
        .status(404)
        .json({ message: "time slot not found for the specified date" });
    }

    const slot = timeSlot.slots;
    return res.status(200).json({ message: "Time slot Found", data: slot });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Internal server Error" });
  }
};

/**==============get Available Dates======================== */
export const getAvailableDates = async (req, res) => {
  console.log("hi iam here");
  const docId = req.params.id;

  try {
    const doctor = await Doctor.findById(docId);

    if (!Doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const dates = doctor.timeSlots.map((timeslot) => timeslot.uniDate);
    console.log(dates, "dates");
    res.status(200).json({ data: dates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**==============get Available filter doctors======================== */

export const filterDoctor = async (req, res) => {
  console.log("Hello filter doctor");
  try {
    const { query } = req.query;
    console.log(query);

    let filterOption;

    switch (query) {
      case "1-500":
        filterOption = { fee: { $gt: 1, $lte: 500 } };
        break;

      case "501-1000":
        filterOption = { fee: { $gte: 501, $lte: 1000 } };
        break;

      case "1001-2000":
        filterOption = { fee: { $gte: 1001, $lte: 2000 } };
        break;

      case "2001-above":
        filterOption = { fee: { $gte: 2001 } };
        break;
    }

    console.log(filterOption);

    const doctors = await Doctor.find(filterOption);
    console.log(doctors);

    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Error in filter by Price", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
