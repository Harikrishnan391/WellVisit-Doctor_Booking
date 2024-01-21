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
} from "../Controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import { getSingleDoctor } from "../Controllers/DoctorController.js";
import {
  makepayment,
  sessionStatus,
} from "../Controllers/paymentController.js";
import { saveBookingData } from "../Controllers/BookingController.js";
import { singleUpload } from "../multer/multer.js";

const router = express.Router();

// router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);
// router.get("/", authenticate, restrict(["admin"]), getAllUser);
// router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);

router.put(
  "/updateUser/:id",
  authenticate,
  restrict(["patient"]),
  singleUpload,
  updateUser
);
router.get("/userProfile", authenticate, restrict(["patient"]), getUserProfile);
router.post("/forgot-password", forgotPassword);
router.route("/reset-password").post(resetPasswordOtpVerify).put(resetPassword);
router.post("/changePassword", changePassword);

// router.get(
//   "/appointments/my-appointments",
//   authenticate,
//   restrict(["patient"]),
//   getMyAppointments
// );

router.get("/getAvailableSlots", getAvailableSlots);
router.get("/getSingleDoctor/:id", getSingleDoctor);
router.get(
  "/getAvailableDates/:id",
  authenticate,
  restrict(["patient"]),
  getAvailableDates
);
router.post("/makePayment", authenticate, restrict(["patient"]), makepayment);
router.get("/session-status", sessionStatus);
router.post("/saveBookingData",saveBookingData)
router.get("/getDoctors/filter", filterDoctor);
router.get("/getMyAppointments",authenticate,getMyAppointments)
export default router;
