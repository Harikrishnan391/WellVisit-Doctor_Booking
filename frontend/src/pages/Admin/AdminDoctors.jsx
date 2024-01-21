import React, { useState, useEffect } from "react";
import fetchDoctors from "../../hooks/userFetchData";
import { BASE_URL, adminToken, doctorPath } from "../../config";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom"
import Pagination from "../../components/pagination/Pagination";
import { FcVideoCall } from "react-icons/fc";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  console.log(doctors, "doctorsssss");
  const [carosal, setCarosal] = useState(false);
  const [slides, setSlides] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [certificate, setCertificate] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerpage] = useState(5);
  console.log(postPerPage, "post per page");

  console.log(certificate, "state Certificate");
  const navigate=useNavigate()
  const modalHandler = (certificate) => {
    setCarosal(true);
    const slides = certificate?.map((certificate) => ({
      certificate: certificate,
    }));
    setSlides(slides);
  };

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const { data, loading, error, refetch } = fetchDoctors(
    `${BASE_URL}/admin/getAlldoctor`
  );

  console.log(data, "data from fetch doctors");

  useEffect(() => {
    if (error) {
      console.log(error);
    } else if (!error && !loading) {
      setDoctors(data);
    }
  }, [error, data, loading]);

  const approveCertificate = async (docId, status) => {
    try {
      const res = await fetch(
        `${BASE_URL}/admin/approveCertificate/${docId}?status=${status}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      let result = res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }
      console.log(res);
      Swal.fire({
        title: "Done!",
        text: "Your changed the doctor status",
        icon: "success",
      });

      refetch();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error Occured while changing the status",
        icon: "error",
      });
      console.log("error", error);
    }
  };

  const handleApprove = async (docId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes,do it!",
      cancelButtonText: "Cancel it",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(`${BASE_URL}/admin/HandleApprove/${docId}`, {
          method: "put",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        let result = res.json();
        if (!res.ok) {
          throw new Error(result.message);
        }
        Swal.fire({
          title: "Done!",
          text: "You Changed the Doctor Status",
          icon: "success",
        });
        refetch();
      } catch (error) {
        console.log("error", error);
        Swal.fire({
          title: "Error!",
          text: "An error occured while changing the status",
          icon: "error",
        });
      }
    }
  };
  //Handle Block

  const handleBlock = async (docId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "yes,do it",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(`${BASE_URL}/admin/HandleBlock/${docId}`, {
          method: "put",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        let result = res.json();
        console.log(result);

        if (!res.ok) {
          throw new Error(result.message);
        }

        Swal.fire({
          title: "Done!",
          text: "You changed the doctor status",
          icon: "success",
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "An error occured while changing the status",
          icon: "error",
        });
      }
    }
  };

  const createRoom=async()=>{
    const {value:roomId}=await Swal.fire({
      title:"Create a Room",
      text:"Enter a Room Id",
      input:"text",
      showCancelButton:true,
      confirmButtonText:"Create"
    })
    if(roomId){
      navigate(`/admin/room/${roomId}`)
    }
  }

  const approveVideoCall = async (docId, status) => {
    try {
      const res = await fetch(
        `${BASE_URL}/admin/approveVideoCall/${docId}?status=${status}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      let result = res.json();
      console.log(result,"result")

    } catch (error) {
      console.log(error,"error")
    }
  };

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentDoctors = doctors.slice(firstPostIndex, lastPostIndex);

  return (
    <div>
      <section className="container">
        <div className="relative mx-5 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-[#FF7043]">
              <tr>
                <th scope="cold" className="px-6 py-3">
                  Sl.No
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Specialization
                </th>
                <th scope="col" className="px-6 py-3">
                  video call
                </th>
                <th scope="col" className="px-6 py-3">
                  Certificate
                </th>
                <th scope="col" className="px-6 py-3">
                  Approve
                </th>
                <th scope="col" className="px-6 py-3">
                  Options
                </th>
              </tr>
            </thead>
            <tbody className="border-2">
              {currentDoctors.length > 0 ? (
                currentDoctors.map((doctor, index) => (
                  <tr
                    className="bg-white border-b hover:bg-gray-100"
                    key={index}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{doctor.name}</td>
                    <td className="px-6 py-4">{doctor.email}</td>
                    <td className="px-6 py-4">{doctor.specialization}</td>

                    <td className="pl-12 cursor-pointer text-[26px] py-4">
                      <FcVideoCall onClick={()=>createRoom()} />
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => approveVideoCall(doctor._id, true)}
                          className={`bg-gray-500 p-1 rounded-lg text-[12px] text-white mr-2 hover:bg-green-500 ${
                            doctor.videoCallApprove ? "bg-green-500" : ""
                          }`}
                        >
                          Pass
                        </button>
                        <button
                          className={`bg-gray-500 p-1 rounded-lg text-[12px] text-white mr-2 hover:bg-green-500 ${
                            doctor.videoCallApprove ? "bg-red-500" : ""
                          }`}
                        >
                          Fail
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        className="flex justify-center hover:text-blue-700 hover:font-medium cursor-pointer mb-2 font-semibold"
                        onClick={() => modalHandler(doctor.certificate)}
                      >
                        View
                      </a>
                      <button
                        onClick={() => approveCertificate(doctor._id, true)}
                        className={`bg-gray-500 p-1 rounded-lg text-[12px] text-white mr-2 hover:bg-green-500 ${
                          doctor.certificateApprove ? "bg-green-500" : ""
                        }`}
                      >
                        Pass
                      </button>

                      <button
                        onClick={() => approveCertificate(doctor._id, false)}
                        className={`bg-gray-500 p-1 rounded-lg text-[12px] text-white mr-2 hover:bg-red-500${
                          !doctor.certificateApprove ? "bg-red-500" : ""
                        }`}
                      >
                        Fail
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleApprove(doctor._id)}
                        className={`px-4 py-2 font-semibold text-green-700  bg-green-100 border border-green-500 rounded-2xl hover:bg-green-500 hover:text-white hover:border-transparent}`}
                        // disabled={!doctor.certificateApprove}
                      >
                        {doctor.isApproved ? "Reject " : "Approve"}
                      </button>
                    </td>

                    {doctor.isBlocked ? (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleBlock(doctor._id)}
                          className={`px-4 py-2 font-semibold text-yellow-700 bg-yellow-100 border-yellow-500 rounded hover:bg-yellow-500 hover:text-white hover:border-transparent`}
                        >
                          Unblock
                        </button>
                      </td>
                    ) : (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleBlock(doctor._id)}
                          className={`px-4 py-2 font-semibold text-red-700 bg-yellow-100 border-red-500 rounded hover:bg-red-500 hover:text-white hover:border-transparent`}
                        >
                          Block
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 font-medium text-center text-gray-900"
                  >
                    No Doctors Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {openModal && (
        <div className="w-[400px] h-[350px] p-4 fixed inset-0 mx-auto my-auto bg-gray-300 drop-shadow-2xl">
          <div>
            <img src={`${doctorPath}${certificate}`} alt="" />
          </div>
          <div>
            <button onClick={() => setOpenModal(false)}>Close</button>
          </div>
        </div>
      )}

      {carosal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="max-w-[500px] h-[500px] w-full m-auto py-16 px-4 relative group">
            <AiOutlineCloseCircle
              onClick={() => setCarosal(false)}
              className=" text-[30px] absolute right-[20px] top-[70px] cursor-pointer "
            />
            <div
              style={{
                backgroundImage: `url(${doctorPath}${slides[currentIndex].certificate})`,
              }}
              className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
            ></div>
            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactLeft onClick={prevSlide} size={30} />
            </div>
            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactRight onClick={nextSlide} size={30} />
            </div>
            <div className="flex top-4 justify-center py-2">
              {slides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className="text-2xl cursor-pointer"
                >
                  <RxDotFilled />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-20">
        <Pagination
          postPerPage={postPerPage}
          totalPosts={doctors.length}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default AdminDoctors;
