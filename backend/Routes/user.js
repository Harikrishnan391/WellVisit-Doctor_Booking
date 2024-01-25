import express from "express";
import multer from "multer";
const upload = multer();

import {
  updateUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  getUserProfile,
  getMyAppointments,
  forgotPassword,
  resetPasswordOtpVerify,
  resetPassword,
  getAvailableSlots,
  getAvailableDates,
  filterDoctor,
  changePassword,
  getMyAppointmentDetails,
  MakeVideoCall,
  googleAuth,
} from "../Controllers/userController.js";

import {
  getRoomMessages,
  getRoom,
  createRoom,
  sendChat,
} from "../Controllers/chatController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import { getSingleDoctor } from "../Controllers/DoctorController.js";
import {
  makepayment,
  sessionStatus,
} from "../Controllers/paymentController.js";
import { saveBookingData } from "../Controllers/BookingController.js";
import { singleUpload } from "../multer/multer.js";

const router = express.Router();
router.put(
  "/updateUser/:id",
  authenticate,
  restrict(["patient"]),
  singleUpload,
  updateUser
);

router.get(
  "/getAvailableSlots",
  authenticate,
  restrict(["patient"]),
  getAvailableSlots
);
router.get("/getSingleDoctor/:id", getSingleDoctor);
router.get(
  "/getAvailableDates/:id",
  authenticate,
  restrict(["patient"]),
  getAvailableDates
);
router.post("/makePayment", authenticate, restrict(["patient"]), makepayment);
router.get(
  "/session-status",
  authenticate,
  restrict(["patient"]),
  sessionStatus
);
router.post(
  "/saveBookingData",
  authenticate,
  restrict(["patient"]),
  saveBookingData
);
router.get("/getDoctors/filter", filterDoctor);
router.get("/getMyAppointments", authenticate, getMyAppointments);
router.get("/getAppointmentsDetails/:id", getMyAppointmentDetails);
router.get("/makeVideoCall/:id", MakeVideoCall);
router.post("/google", googleAuth);
router.get("/userProfile", authenticate, restrict(["patient"]), getUserProfile);
router.post("/forgot-password", forgotPassword);
router.route("/reset-password").post(resetPasswordOtpVerify).put(resetPassword);
router.post("/changePassword", changePassword);

router.get(
  "/getRoomMessage/:roomId",
  authenticate,
  restrict(["patient"]),
  getRoomMessages
);
router.get(
  "/getRoom/:doctorId/:userId",
  authenticate,
  restrict(["patient"]),
  getRoom
);
router.post(
  "/createRoom/:doctorId/:userId",
  authenticate,
  restrict(["patient"]),
  createRoom
);
router.post(
  "/sendChat/:sender/:roomId/:type/:Id/:senderName",
  authenticate,
  restrict(["patient"]),
  sendChat
);
export default router;
