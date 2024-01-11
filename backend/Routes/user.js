import express from "express";

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
} from "../Controllers/userController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";
import { getSingleDoctor } from "../Controllers/DoctorController.js";
import { makepayment } from "../Controllers/paymentController.js";

const router = express.Router();

// router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);
// router.get("/", authenticate, restrict(["admin"]), getAllUser);
// router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);

router.put("/updateUser/:id", authenticate, restrict(["patient"]), updateUser);
router.get("/userProfile", authenticate, restrict(["patient"]), getUserProfile);
router.post("/forgot-password", forgotPassword);
router.route("/reset-password").post(resetPasswordOtpVerify).put(resetPassword);
router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient"]),
  getMyAppointments
);

router.get("/getAvailableSlots", getAvailableSlots);
router.get("/getSingleDoctor/:id", getSingleDoctor);
router.get("/getAvailableDates/:id", getAvailableDates);
router.post("/makePayment", makepayment);
router.get("/getDoctors/filter", filterDoctor);
export default router;
