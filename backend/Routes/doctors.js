import express from "express";

import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  // getSingleDoctor,
  getDoctorProfile,
  addTimeSlots,
  getAvailableDates,
  getAvailableSlots,
  removeSlots
} from "../Controllers/DoctorController.js";
import { authenticateDoctor, restrict } from "../auth/verifyDoctorToken.js";
import reviewRouter from "./review.js";
import { authenticate } from "../auth/verifyToken.js";

const router = express.Router();

// nested Route
router.use("/:doctorId/reviews", reviewRouter);

// router.get("/:id", getSingleDoctor);
router.get("/getAllDoctor", authenticate, getAllDoctor);
router.put("/:id", authenticateDoctor, restrict(["doctor"]), updateDoctor);
router.delete("/:id", authenticateDoctor, restrict(["doctor"]), deleteDoctor);

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

router.get('/removeSlots',
authenticateDoctor,
restrict(["doctor"]),
removeSlots
)

export default router;
