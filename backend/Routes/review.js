import express from "express";

import {
  getAllReviews,
  createReview,
  getDoctorReviews,
  EditReview,
  DeleteReview
} from "../Controllers/reviewController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";

const router =express.Router()

router.post('/createReview',authenticate,createReview)
router.get('/getDoctorReviews/:id',authenticate,getDoctorReviews)

router.put("/editReview/:id",EditReview)
router.delete("/deleteReview/:id",DeleteReview)





export default router
