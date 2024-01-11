import Review from "../model/ReviewSchema.js";

import Doctor from "../model/DoctorSchema.js";

//get all Reviews

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res
      .status(200)
      .json({ sucess: true, message: "Successfull", data: reviews });
  } catch (err) {
    res.status(404).json({ sucess: false, message: "Successfull" });
  }
};

//create Review

export const createReview = async (req, res) => {
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.params.userId;

  const newReview = new Review(req.body);

  try {
    const savedReview = await newReview.save();

    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });
    res.status();

    res
      .status(200)
      .json({ success: true, message: "Review Submitted", data: savedReview });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};
