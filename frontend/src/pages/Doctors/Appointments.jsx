import React, { useState, useEffect } from "react";
import DoctorFetchData from "../../hooks/DoctorFetchData";
import { BASE_URL, docToken } from "../../config";
const path = "http://localhost:5000/userMedia/";
import { FcVideoCall } from "react-icons/fc";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../components/pagination/Pagination";

const Appointments = () => {
  const [Appointments, setAppointments] = useState([]);
  const [TotalEarnings, setTotalEarnings] = useState("");
  const [TotalAppointments, setTotalAppointments] = useState("");
  const [CancellAppointment, setCancelledAppointments] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(6);

  const { error, loading, data, result, refetch } = DoctorFetchData(
    `${BASE_URL}/doctors/getMyAppointments`
  );
  console.log(result, "appoitments");

  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      console.log(error);
    } else {
      setAppointments(data);
      setTotalEarnings(result.totalEarnings);
      setTotalAppointments(result.totalAppointments);
      setCancelledAppointments(result.cancelledAppointments);
    }
  }, [Appointments, data, loading]);

  const handleCancel = async (BookingId) => {
    const { value: reason } = await Swal.fire({
      title: "Do you want to Cancel This appointment?",
      input: "text",
      inputLabel: "Reason for Cancellation",
      inputPlaceholder: "Enter the Reason for Cancellation",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes,do it!",
      cancelButtonText: "Cancel it",
      inputValidator: (value) => {
        if (!value) {
          return "You need to Provide reason";
        }
      },
    });

    if (reason) {
      try {
        const res = await fetch(
          `${BASE_URL}/doctors/CancellAppointment/${BookingId}`,
          {
            method: "post",
            headers: {
              Authorization: `Bearer ${docToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason }),
          }
        );

        let result = await res.json();

        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        Swal.fire({
          title: "Done!",
          text: "Your cancelled the appointment.",
          icon: "success",
        });
        refetch();
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "error!",
          text: "An error Occured while cancelling",
          icon: "success",
        });
      }
    }
  };

  const createRoom = async () => {
    const { value: roomId } = await Swal.fire({
      title: "CreateRoom",
      text: "Enter a Room Id",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Create",
    });

    if (roomId) {
      navigate(`/doctors/room/${roomId}`);
    }
  };

  const approveVideoCall = async (patientId, status) => {
    const confirmResult = await Swal.fire({
      title: "Do you want to approve VideoCall?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes,do it!",
      cancelButtonText: "Cancel it",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(
          `${BASE_URL}/doctors/approveVideoCall/${patientId}?status=${status}`,
          {
            method: "post",
            headers: {
              Authorization: `Bearer ${docToken}`,
            },
          }
        );

        let result = await res.json();
        console.log(result, "result");

        if (!res.ok) {
          throw new Error(result.message);
        }

        Swal.fire({
          title: "Done!",
          text: "Your changed the doctor status",
          icon: "success",
        });
        const roomId = result.roomId;

        navigate(`/doctors/room/${result.roomId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentAppointments = Appointments.slice(firstPostIndex, lastPostIndex);

  return (
    <>
      <section className="text-gray-600 body-font bg-gray-50  flex justify-center items-center">
        <div className="container px-5 py- mx-auto">
          <div className="flex flex-wrap -m-4 text-center">
            <div className="p-4 sm:w-1/2 lg:w-1/3 w-full hover:scale-105 duration-500">
              <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                <div>
                  <h2 className="text-gray-900 text-lg font-bold">
                    Total Appointmets
                  </h2>
                </div>
                <div className="bg-gradient-to-tr from-blue-400 to-purple-500 w-32 h-32 rounded-full shadow-2xl border-white border-dashed border-2 flex justify-center items-center ">
                  <div>
                    <h1 className="text-white text-2xl">
                      {TotalAppointments
                        ? TotalAppointments
                        : "No appointments Yet"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/3 w-full hover:scale-105 duration-500">
              <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                <div>
                  <h2 className="text-gray-900 text-lg font-bold">
                    Total Earnings
                  </h2>
                </div>
                <div className="bg-gradient-to-tr from-green-400 to-blue-500 w-32 h-32 rounded-full shadow-2xl border-white border-dashed border-2 flex justify-center items-center">
                  <div>
                    <h1 className="text-white text-2xl">
                      {TotalEarnings ? TotalEarnings : "0"}.Rs
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:w-1/2 lg:w-1/3 w-full hover:scale-105 duration-500">
              <div className=" flex items-center  justify-between p-4  rounded-lg bg-white shadow-indigo-50 shadow-md">
                <div>
                  <h2 className="text-gray-900 text-lg font-bold">
                    Cancelled Appointments
                  </h2>
                </div>
                <div className="bg-gradient-to-tr from-red-500 to-red-400 w-32 h-32  rounded-full shadow-2xl shadow-red-400 border-white  border-dashed border-2  flex justify-center items-center ">
                  <div>
                    <h1 className="text-white text-2xl">
                      {CancellAppointment ? CancellAppointment : "0"}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto p-6 font-mono">
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white uppercase bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action/VideoCall</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentAppointments &&
                  currentAppointments.map((el, index) => (
                    <tr key={index} className="text-gray-700">
                      <td className="px-4 py-3 border">
                        <div className="flex items-center text-sm">
                          <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                            <img
                              className="object-cover w-full h-full rounded-full"
                              src={`${path}${el.patient.photo}`}
                              alt=""
                              loading="lazy"
                            />
                            <div
                              className="absolute inset-0 rounded-full shadow-inner"
                              aria-hidden="true"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-black">
                              {el.patient.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {el.patient.gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ms font-semibold border">
                        {el.IndianDate}
                      </td>
                      <td className="px-4 py-3 text-sm border">{el.slot}</td>
                      <td className="px-4 py-3 text-xs border">
                        {el.isCancelled ? (
                          <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm">
                            {" "}
                            Appointment Cancelled{" "}
                          </span>
                        ) : (
                          <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm">
                            {" "}
                            Acceptable{" "}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ms font-semibold border">
                        <div className="flex items-center ">
                          <button
                            onClick={() => handleCancel(el._id)}
                            className={`bg-red-500 hover:bg-pink-700 text-white font-bold py-2 px-4 border border-white-700 rounded ${
                              el.isCancelled
                                ? "opacity-50 curor-not-allowed"
                                : ""
                            }`}
                            disabled={el.isCancelled}
                          >
                            Cancel
                          </button>
                          {/* <FcVideoCall
                            onClick={() =>
                              approveVideoCall(el.patient._id, true)
                            }
                            className="ml-2 text-2xl w-7 cursor-pointer"
                          /> */}
                          {!el.isCancelled && (
                            <FcVideoCall
                              onClick={() =>
                                approveVideoCall(el.patient._id, true)
                              }
                              className="ml-2 text-2xl w-7 cursor-pointer"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-20">
          <Pagination
            postPerPage={postPerPage}
            totalPosts={Appointments.length}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
};

export default Appointments;
