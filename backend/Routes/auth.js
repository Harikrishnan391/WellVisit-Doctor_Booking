import express from "express";
import {
  register,
  login,
  verifyOtp,
  resendOtp,
} from "../Controllers/authController.js";
import {
  doctorSendOtp,
  doctorVerifyOtp,
} from "../Controllers/doctorAuthController.js";
import { multipleUpload } from "../multer/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-Otp", resendOtp);
router.post("/login", login);

router.post("/doctorSendOtp", multipleUpload, doctorSendOtp);
router.post("/doctorVerifyOtp", doctorVerifyOtp);

export default router;
