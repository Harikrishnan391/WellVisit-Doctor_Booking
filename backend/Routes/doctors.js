import express from "express";

import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getDoctorProfile,
  addTimeSlots,
  getAvailableDates,
  getAvailableSlots,
  removeSlots,
  DoctorForgotPassword,
  resetPasswordOtpVerify,
  DoctorResetPassword,
  resendOtp,
  changeDoctorPassword,
  getAppointments,
  approveVideoCall,
  CancellAppointment
} from "../Controllers/DoctorController.js";
import { getDoctorRooms,getRoomMessages,sendChat } from "../Controllers/chatController.js";
import { authenticateDoctor, restrict } from "../auth/verifyDoctorToken.js";
import reviewRouter from "./review.js";
import { authenticate } from "../auth/verifyToken.js";
import { multipleUpload } from "../multer/multer.js";


const router = express.Router();

// nested Route
router.use("/:doctorId/reviews", reviewRouter);

router.get("/getAllDoctor", authenticate, getAllDoctor);
router.put(
  "/updateDoctor/:id",
  authenticateDoctor,
  restrict(["doctor"]),
  multipleUpload,
  updateDoctor
);
router.delete("/:id", authenticateDoctor, restrict(["doctor"]), deleteDoctor);
router.get("/getMyAppointments", authenticateDoctor, getAppointments);
router.get(
  "/getDoctorProfile",
  authenticateDoctor,
  restrict(["doctor"]),
  getDoctorProfile
);
router.put("/updateDoctor/:id", updateDoctor);
router.post(
  "/addTimeSlots",
  authenticateDoctor,
  restrict(["doctor"]),
  addTimeSlots
);
router.get(
  "/getAvailableDates",
  authenticateDoctor,
  restrict(["doctor"]),
  getAvailableDates
);

router.get(
  "/getAvailableSlots/:date",
  authenticateDoctor,
  restrict(["doctor"]),
  getAvailableSlots
);

router.get(
  "/removeSlots",
  authenticateDoctor,
  restrict(["doctor"]),
  removeSlots
);
router.get("/get-doctor-rooms/:id",authenticateDoctor,getDoctorRooms)
router.get("/get-rooms-messages/:roomId",authenticateDoctor,getRoomMessages)
router.post('/sendChat/:roomId/:sender/:type/:Id/:senderName',authenticateDoctor,restrict(['doctor']),sendChat)
router.post("/forgot-password", DoctorForgotPassword);
router.post("/reset-password", resetPasswordOtpVerify);
router.post("/DoctorResetPassword", DoctorResetPassword);
router.post("/resend-Otp", resendOtp);
router.post("/changePassword", changeDoctorPassword);
router.post("/approveVideoCall/:id", approveVideoCall);
router.post("/CancellAppointment/:id",CancellAppointment)
export default router;
