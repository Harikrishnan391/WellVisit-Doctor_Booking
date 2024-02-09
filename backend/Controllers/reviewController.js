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
  const { rating, reviewText, user, doctor } = req.body.review;

  const newReview = new Review(req.body.review);

  try {
    const StoredReview = await newReview.save();

    await Doctor.findByIdAndUpdate(doctor, {
      $push: { reviews: StoredReview._id },
    });

    res
      .status(200)
      .json({ success: true, message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ success: true, message: "Internal server Error" });
    console.log(error, "Error");
  }
};

export const getDoctorReviews = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const reviews = await Review.find({ doctor: doctorId }).populate({
      path: "user",
      select: "name photo",
    });

    res
      .status(200)
      .json({ success: true, message: "Successfull", data: reviews });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Not found" });
  }
};

/////  Edit the Revieww /////

export const EditReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  const reviewId = req.params.id;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        reviewText,
      },
      { new: true }
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review Not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Review updated Successfully" });
  } catch (error) {
    console.log("Error updating Review", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

///// Delete Review /////

export const DeleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const DeleteReview = await Review.findByIdAndDelete(reviewId);

    if (!DeleteReview) {
      res
        .status(404)
        .json({ success: false, message: "Unable to delete Review" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Review Deleted Successfully" });
    }
  } catch (error) {
    console.log("Error updating Review", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
