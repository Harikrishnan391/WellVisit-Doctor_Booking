import User from "../model/UserSchema.js";
import Doctor from "../model/DoctorSchema.js";
import bcrypt from "bcryptjs";
import generatePatientToken from "../jwt/patient/patientjwt.js";
import generateDoctorToken from "../jwt/doctor/doctorjwt.js";
import { sendOtpTwlio } from "./otpController.js";
import generateOTP from "../utils/generateOtp.js";
import generateMail from "../utils/generateMail.js";

/**========================================================================= */
//                         Sending OTP
/**========================================================================= */

export const sendOtp = async (req, res) => {
  try {
    const phoneNumber = req.body.data.number;
    const email = req.body.data.email;
    const type = req.body.data.role;
    let user = null;

    if (type === "patient") {
      user = await User.findOne({ email });
    } else if (type === "doctor") {
      user = await Doctor.findOne({ email });
    }

    // Checking if the user exists

    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const otp = await sendOtpTwlio(phoneNumber);

    res.status(200).json({ status: true, message: "otp send successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "error in sending otp" });
  }
};

/**========================================================================= */
//                         User Registeration
/**========================================================================= */

export const register = async (req, res) => {
  const { name, email, number, password, gender, role } = req.body;
  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    //check user exist
    if (user) {
      return res.status(400).json({ message: "User is already exist" });
    }

    //hash password

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const verificationCode = generateOTP();

    if (role === "patient") {
      user = await  User.create({
        name,
        email,
        number,
        password: hashPassword,
        gender,
        role,
        verificationCode,
      });
    }
    if (role === "doctor") {
      user = await  Doctor.create({
        name,
        email,
        password: hashPassword,
        gender,
        role,
        verificationCode,
        
      });
    }

    const status = await generateMail(verificationCode, email);
    console.log(status);

    if (status?.success) {
      return res.status(200).json({
        status: 200,
        message:
          "User registered successfully. Check your email for verification",
        userData: {
          name: user._doc.name,
          email: user._doc.email,
          phone: user._doc.phone,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ failed: true, message: "Internal server error try Again" });
  }
};

/**========================================================================= */
//                         For Verifying OTP
/**========================================================================= */

export const verifyOtp = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });
    console.log(user.verificationCode, "verification code");
    // if (!user) {
    //   res.status(400);
    //   throw new Error("Invalid user Data");
    // }

    if (user.verificationCode !== verificationCode) {
      throw new Error("Otp is incorrect");
    }
    user.isVerified = true;
    await user.save();
    // generatePatientToken(user._id, res);
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Account verified successfully.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

/**========================================================================= */
//                         Resending OTP after The TIme expired
/**========================================================================= */

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid user");
  }

  const verificationCode = generateOTP();
  const status = await generateMail(verificationCode, user.email);

  if (status.success) {
    user.verificationCode = verificationCode;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Otp Resend Successfully please check email for the OTP",
    });
  } else if (!status?.success) {
    res.status(500);

    throw new Error("Server is temporarly Unavaliable");
  }
};

/**========================================================================= */
//                        User And Doctor Login
/**========================================================================= */

export const login = async (req, res) => {
  let token;
  try {
    const { email, password, role } = req.body;
    const userModel = role === "patient" ? User : Doctor;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(404).json({ message: "Invalid user" });
    } else {
      if (user.isBlocked) {
        res.status(401).json({ message: "User is blocked" });
      } else {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(isPasswordMatch);
        if (!isPasswordMatch) {
          res.status(400).json({ message: "Invalid email or password" });
        } else {
          if (role === "doctor" && !user.isApproved) {
            res.status(401).json({ message: "Doctor approval pending" });
          } else if (role === "patient" && !user.isVerified) {
            res.status(401).json({ message: "Please verify your account" });
          } else {
            if (role === "patient") {
              token = generatePatientToken(user._id, res);
            } else if (role === "doctor") {
              console.log("user._id", user._id);

              token = generateDoctorToken(user._id, res);
            }
            // const token = generateToken(user);

            // console.log("tokennnmmmmm", token);
            // res.cookie("jwtPatient", token, { httpOnly: true, maxAge: maxAge * 1000 });
            const { password, appointments, ...rest } = user._doc;
            res.status(200).json({
              status: true,
              message: "Login Successful!!",
              token,
              data: { ...rest, token: token },
              role,
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Failed to login!" });
  }
};
