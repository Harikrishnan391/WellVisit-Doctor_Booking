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
    console.log();

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
  console.log(doctorId);
  try {
    const reviews = await Review.find({ doctor: doctorId }).populate({
      path: "user",
      select: "name photo",
    });
    console.log(reviews, "reviews");
    res.status(200).json({success:true,message:"Successfull",data:reviews})
  } catch (error) {
    console.log(error);
    res.status(404).json({success:false,message:"Not found"})
  }
};
