import express from "express";

import {
  getAllReviews,
  createReview,
  getDoctorReviews
} from "../Controllers/reviewController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";

const router =express.Router()

router.post('/createReview',authenticate,createReview)
router.get('/getDoctorReviews/:id',authenticate,getDoctorReviews)





export default router
