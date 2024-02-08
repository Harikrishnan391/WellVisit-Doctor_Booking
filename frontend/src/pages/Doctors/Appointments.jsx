import React, { useState, useEffect } from "react";
import DoctorFetchData from "../../hooks/DoctorFetchData";
import { BASE_URL, docToken } from "../../config";
const path = "http://localhost:5000/userMedia/";
import { FcVideoCall } from "react-icons/fc";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Appointments = () => {
  const [Appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(6);
  const { error, loading, data, refetch } = DoctorFetchData(
    `${BASE_URL}/doctors/getMyAppointments`
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      console.log(error);
    } else {
      setAppointments(data);
    }
  }, [Appointments, data, loading]);

  const handleCancel = async (BookingId) => {
    const confirmResult = await Swal.fire({
      title: "Do you want to Cancel This appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes,do it!",
      cancelButtonText: "Cancel it",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(
          `${BASE_URL}/doctors/CancellAppointment/${BookingId}`,
          {
            method: "post",
            headers: {
              Authorization: `Bearer ${docToken}`,
            },
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

  console.log(currentAppointments, "currentAppointments");

  return (
    <>
      <section className="container mx-auto p-6 font-mono">
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
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
                            className="bg-red-500 hover:bg-pink-700 text-white font-bold py-2 px-4 border border-white-700 rounded"
                          >
                            Cancel
                          </button>
                          <FcVideoCall
                            onClick={() =>
                              approveVideoCall(el.patient._id, true)
                            }
                            className="ml-2 text-2xl w-7 cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Appointments;
