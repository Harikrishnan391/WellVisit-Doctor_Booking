import Doctor from "../model/DoctorSchema.js";
import generateOTP from "../utils/generateOtp.js";
import generateMail from "../utils/generateMail.js";
import bcrypt from "bcryptjs";

export const doctorSendOtp = async (req, res) => {
  console.log("hellooo");
  console.log(req.body, "req.body");

  try {
    const {
      name,
      email,
      number,
      password,
      gender,
      type,
      degree,
      specialization,
      college,
      photo,
      certificate,
    } = req.body;
    // const photPath = req.files?.photo[0].filename;
    // const certificatePath = req.files?.certificate[0].filename;
    let user = null;
    user = await Doctor.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "user Already exisit" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const verificationCode = generateOTP();
    user = await Doctor.create({
      name,
      email,
      number,
      password: hashPassword,
      gender,
      role: type,   
      degree,
      certificate,
      photo,  
      specialization,
      college,
      verificationCode,
    });

    const status = await generateMail(verificationCode, email);
   

    if (status?.success) {
      return res.status(200).json({
        doctorData: {
          name: user._doc.name,
          email: user._doc.email,
          phone: user._doc.number,
        },
        status: 200,
        message: "Doctor Registered successfully .Check email for verfication",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      failed: true,
      message: "Internal server Error",
    });
  }
};

export const doctorVerifyOtp = async (req, res) => {
  try {
    console.log("doctor Verify otp......");
    const { email, verificationCode } = req.body;
    const doctor = await Doctor.findOne({ email });
    console.log(doctor.verificationCode, "verification code");
    if (doctor.verificationCode !== verificationCode) {
      throw new Error("Otp is incorrect");
    }
    doctor.isVerified = true;
    await doctor.save();

    return res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      message: "Account Verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
