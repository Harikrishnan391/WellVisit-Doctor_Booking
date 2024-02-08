import express from "express";
import { authenticateAdmin } from "../auth/verifyAdminToken.js";

import {
  BlockUser,
  approveCertificate,
  HandleApprove,
  getAllDoctor,
  getAllUser,
  login,
  HandleBlock,
  approveVideoCall,
  getMonthlyBooking,
  getBooking,
  cancelBooking
} from "../Controllers/AdminController.js";

const router = express.Router();

router.post("/BlockUser/:id", authenticateAdmin, BlockUser);
router.post("/login", login);
router.get("/getAllUser", getAllUser);

// router.post('/UnblockUser/:id',UnblockUser)
router.get("/getAllDoctor", getAllDoctor);
router.post("/approveCertificate/:id", authenticateAdmin, approveCertificate);
router.put("/HandleApprove/:id", authenticateAdmin, HandleApprove);
router.put("/HandleBlock/:id", authenticateAdmin, HandleBlock);
router.post("/approveVideoCall/:id", authenticateAdmin, approveVideoCall);
router.get("/MonthlyBooking",authenticateAdmin,getMonthlyBooking)
router.get("/getBooking",authenticateAdmin,getBooking)
router.put("/cancelBooking/:id",authenticateAdmin,cancelBooking)


export default router;
