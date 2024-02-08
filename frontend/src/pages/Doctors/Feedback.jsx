import React, { useEffect, useState } from "react";
import avatar from "../../assets/images/avatar-icon.png";
import { FormateDate } from "../../utils/FormateDate";
import { AiFillStar } from "react-icons/ai";
import FeedbackForm from "./FeedbackForm";
import { BASE_URL, token } from "../../config";
import dayjs from "dayjs"

const Feedback = ({ details }) => {
  const [showFeedbackForm, setshowFeedbackForm] = useState(false);
  const [reviews, setReview] = useState([]);
  const user = JSON.parse(localStorage.getItem("PatientInfo"));
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(3);

  useEffect(() => {
    const fetchReviews = async (req, res) => {
      try {
        const res = await fetch(
          `${BASE_URL}/reviews/getDoctorReviews/${details._id}`,
          {
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await res.json();
        setReview(result.data);

        console.log(result, "result from feedback");
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, []);

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentReviews = reviews.slice(firstPostIndex, lastPostIndex);

  return (
    <div>
      <div className="mb-[50px ]">
        <h4 className="text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]">
          All Reviews({reviews.length})
        </h4>
        {currentReviews.map((el, index) => (
          <div key={index} className="flex justify-between gap-10 mb-[30px]">
            <div className="flex gap-3">
              <figure className="w-10 h-10 rounded-full ">
                <img className="w-full" src={user.photo
                } alt="" />
              </figure>

              <div>
                <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
                  {el.user.name}
                </h5>
                <p className="text-[14px] leading-6 text-textColor ">
                  {dayjs (el.createdAt).format("DD/MM/YYYY")}
                </p>
                <p className="text_para mt-3 font-medium text-[15px] ">
                 {el.reviewText}
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              {[...Array(el.rating).keys()].map((_, index) => (
                <AiFillStar key={index} color="#FFAD01" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {!showFeedbackForm && (
        <div className="text-center">
          <button className="btn" onClick={() => setshowFeedbackForm(true)}>
            Give Feedback
          </button>
        </div>
      )}

      {showFeedbackForm && (
        <FeedbackForm
          details={details}
          setshowFeedbackForm={setshowFeedbackForm}
        />
      )}
    </div>
  );
};

export default Feedback;
