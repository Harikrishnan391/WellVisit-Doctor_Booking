import userFetchData from "../../hooks/userFetchData";
import { useState } from "react";
import { BASE_URL, token } from "../../config";
import DoctorCard from "../../components/Doctors/DoctorCard";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { IoIosNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import { doctorPath } from "../../config";
import Swal from "sweetalert2";
import starIcon from "../../assets/images/Star.png";
import { LiaCertificateSolid } from "react-icons/lia";
const MyBookings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(6);
  const {
    data: appointments,
    loading,
    error,
    refetch,
  } = userFetchData(`${BASE_URL}/users/getMyAppointments`);

  const handleCancel = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you Sure",
      text: "you won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes cancel it!",
      cancelButtonText: "No",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(`${BASE_URL}/users/cancelBooking/${id}`, {
          method: "put",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
         // Display success message
         Swal.fire({
          title: "Cancelled!",
          text: "Your Booking has been cancelled.",
          icon: "success",
        });

        // Perform any additional actions (e.g., refetch data)
        refetch();
        if(!res.ok){
          throw new Error(result.message)
        }
        console.log(result, "result");
      } catch (error) {
        console.log(error)
      }
    }
  };

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = appointments.slice(firstPostIndex, lastPostIndex);
  console.log(currentPosts, "currentPost");
  return (
    <>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mt-8 w-[750px] ">
        {currentPosts.map((el) => (
          <div
            className={`p-3 m-8 transition-transform transform rounded-md shadow-lg lg:p-0 hover:scale-105 sm:m-4 lg:m-0
            }`}
          >
            <div
              onClick={() =>
                Swal.fire({
                  html: `<div style="text-align: center;">
                <h2 style="color: red; margin-bottom: 10px; font-size: 1.5em;">Booking Cancelled by the Doctor!</h2>
                <span style="font-size: 15px;">Reason: ${el.cancelReason}</span>
                <p style="font-weight: bold; margin-top: 10px;">Your money will be credited to the wallet</p>
              </div>`,
                })
              }
              className={` ${
                el.cancelReason ? "block" : "hidden"
              } absolute right-[-5px] top-[-10px] text-[18px] text-red-500 opacity-100 cursor-pointer`}
            >
              <IoIosNotifications style={{ opacity: 1 }} />
            </div>
            <div
              className={`${
                el.isCancelled ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Link to={`/users/bookingDetails/${el._id}`} key={el._id}>
                <div>
                  <div>
                    <img
                      src={el.doctor.photo ? `${el.doctor.photo}` : starIcon}
                      alt=""
                      className="w-full"
                    />
                  </div>

                  <h3 className="text-[18px] leading-[30px] lg:text-[20px] text-headingColor font-[700] mt-3 p-2">
                    Dr. {el.doctor.name}
                  </h3>

                  <div className="flex items-center justify-between gap-3 p-2">
                    <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[12px] lg:leading-7 font-semibold rounded">
                      {el.doctor.specialization}
                    </span>
                    <div className="flex items-center justify-end">
                      <span className="flex items-center gap-[1px] text-[12px] leading-6 lg:text-[15px] lg:leading-7 font-semibold text-headingColor">
                        {/* <img src={starIcon} className="w-5" alt="" /> */}
                        <LiaCertificateSolid className="w-12 h-8 bg-yellowColor" />
                        {el.doctor.degree}
                      </span>
                      <span className="text-[10px] ml-7 leading-6 lg:text-[12px] lg:leading-7 font-[400] text-headingColor">
                        {/* (282) */}
                      </span>
                    </div>

                    <div className="mt-[18px] lg:mt-5 flex items-center justify-between"></div>
                  </div>
                  <div className="flex justify-around">
                    <h3 className="text-[10px] mt-0 leading-7 lg:text-[13px] font-semibold text-headingColor p-2">
                      {el.IndianDate}
                    </h3>
                    <h3 className="text-[10px] mt-0 leading-7 lg:text-[13px] font-semibold text-headingColor p-2">
                      {el.slot}
                    </h3>
                  </div>
                </div>
              </Link>
              <div>
                <button
                  onClick={() => handleCancel(el._id)}
                  className="bg-gray-500 hover:bg-red-500 w-full leading-9 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 
      <div className=" flex justify-between lg:grid-cols-3 mt-8 w-[750px]">
        {currentPosts.map((el) => (
          <div
            key={el._id}
            className={`h-72 mx-4 w-72 bg-blue-400 rounded-3xl shadow-md sm:w-80 sm:mx-0 mt-8 ${
              el.isCancelled ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="h-1/2 w-full flex justify-between items-baseline px-3 py-5">
              <h1 className="text-white">Profile</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="bg-white h-1/2 w-full rounded-3xl flex flex-col justify-around items-center">
              <div className="w-full h-1/2 flex justify-between items-center px-3 pt-2">
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-gray-500 text-xs">Orders</h1>
                  <h1 className="text-gray-600 text-sm">340</h1>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-gray-500 text-xs">Spent</h1>
                  <h1 className="text-gray-600 text-sm">$2,004</h1>
                </div>
              </div>
              <div className="w-full h-1/2 flex flex-col justify-center items-center">
                <h1 className="text-gray-700 font-bold">Maria R.</h1>
                <h1 className="text-gray-500 text-sm">New York, USA</h1>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </>
  );
};

export default MyBookings;
