import Doctor from "../model/DoctorSchema.js";
import generateOTP from "../utils/generateOtp.js";
import generateMail from "../utils/generateMail.js";
import bcrypt from "bcryptjs";

// import { sendOtpTwlio, verifyCodeTwilio } from "./otpController.js";
// import Jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// export const doctorSendOtp = async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log(req.files);
//     const phoneNumber = req.body.number;
//     const email = req.body.email;
//     const photoPath = req.files?.photo[0].filename;
//     const certificatePath = req.files?.certificate[0].filename;
//     console.log(photoPath);
//     console.log(certificatePath);

//     let user = null;

//     user = await Doctor.findOne({ email });

//     // Checking if the user exists

//     if (user) {
//       return res.status(400).json({ message: "User Already Exists" });
//     }

//     const otp = await sendOtpTwlio(phoneNumber);
//     console.log(otp);

//     res.status(200).json({
//       status: true,
//       message: "otp send successfully",
//       photoPath: photoPath,
//       certificatePath: certificatePath,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: false, message: "error in sending otp" });
//   }
// };

// export const doctorVerifyOtp = async (req, res) => {
//   try {
//     console.log(req.body);
//     const email = req.body.storedData.formData.email;
//     const number = req.body.storedData.formData.number;
//     const name = req.body.storedData.formData.name;
//     const degree = req.body.storedData.formData.degree;
//     const password = req.body.storedData.formData.password;
//     const gender = req.body.storedData.formData.gender;
//     const specialization = req.body.storedData.formData.specialization;
//     const role = req.body.storedData.formData.type;
//     const college = req.body.storedData.formData.college;
//     const photo = req.body.storedData.photoPath;
//     const certificate = req.body.storedData.certificatePath;
//     const otp = req.body.otp;
//     console.log(otp, "otp");

//     // const verified = await verifyCodeTwilio(number, otp);
//     const verified=true
//     if (verified) {
//       const salt = await bcrypt.genSalt(10);

//       const hashedPassword = await bcrypt.hash(password, salt);

//       let user = new Doctor({
//         name,
//         email,
//         number,
//         password: hashedPassword,
//         gender,
//         role,
//         photo,
//         certificate,
//         degree,
//         specialization,
//         college,
//       });

//       const userResult = await user.save();

//       res.status(200).json({ message: "User Created Successfully" });
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Internal server error,Try again" });
//   }
// };

/** Doctor Otp verification using  Node mail */

export const doctorSendOtp = async (req, res) => {
  try {
    console.log(req.body, "req.body");
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
    } = req.body;
    const photPath = req.files?.photo[0].filename;
    const certificatePath = req.files?.certificate[0].filename;
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
      certificate: certificatePath,
      photo: photPath,
      specialization,
      college,
      verificationCode,
    });

    const status = await generateMail(verificationCode, email);
    console.log(status);

    if (status?.success) {
      return res.status(200).json({
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
    const doctor=await Doctor.findOne({email})
    console.log(doctor.verificationCode,"verification code")
    if(doctor.verificationCode !==verificationCode){
      throw new Error("Otp is incorrect")
    }
    doctor.isVerified=true
    await doctor.save()

    return res.status(201).json({
      _id:doctor._id,
      name:doctor.name,
      email:doctor.email,
      message:"Account Verified successfully"

    })
    
  } catch (error) {
    res.status(500).json({message:error.message})
  }
};


