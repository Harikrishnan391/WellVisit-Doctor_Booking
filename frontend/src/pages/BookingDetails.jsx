import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL, token } from "../config";
import { doctorPath } from "../config";
import { FcVideoCall } from "react-icons/fc";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { SkewLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
const BookingDetails = () => {
  const [data, setData] = useState({});
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(false);
  console.log(doctor, "doctor");

  let { id } = useParams();

  const user = useSelector((state) => state.patientAuthReducer.PatientInfo);

 const navigate=useNavigate()

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/users/getAppointmentsDetails/${id}`,
          {
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let result = await res.json();
        console.log(result), "result";
        setData(result.data);
        setDoctor(result.data.doctor);

        if (!res.ok) {
          throw new Error(result.message);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchBookingData();
  }, []);

  {
    /** createRoom */
  }

  const createRoom = async () => {
    const { value: roomId } = await Swal.fire({
      title: "CreateRoom",
      text: "Enter a Room Id",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Create",
    });

    if(roomId){
      navigate(`/users/room/${roomId}`)

    }
  };
  const MakeVideoCall = async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/users/makeVideoCall/${userId}`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Something Went Wrong ",
          text: result.error,
        });
      } else {
        createRoom();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="grid  grid-cols-3 p-7 ">
      <div>
        <div className="m-10 max-w-sm ">
          <div className="rounded-lg border bg-white px-4 pt-8 pb-10 shadow-lg">
            <div className="relative mx-auto w-36 rounded-full">
              <span className="absolute right-0 m-3 h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-300 ring-offset-2"></span>
              <img
                className="mx-auto h-full w-full rounded-full object-cover"
                src={`${doctorPath}${doctor.photo}`}
                alt=""
              />
            </div>

            <h1 className="my-1 text-center text-xl font-bold leading-8 text-gray-900">
              {doctor.name}
            </h1>
            <h3 className="font-lg text-semibold text-center leading-6 text-gray-600">
              {doctor.specialization}
            </h3>

            <ul className="mt-3 divide-y rounded bg-gray-100 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
              <li className="flex items-center py-3 text-sm">
                <span>Status</span>
                <span className="ml-auto">
                  <span className="rounded-full bg-green-200 py-1 px-2 text-xs font-medium text-green-700">
                    Paid ₹{doctor.fee}
                  </span>
                </span>
              </li>
              <li className="flex items-center py-3 text-sm">
                <span>Date</span>
                <span className="ml-auto"> {data.IndianDate}</span>
              </li>
              <li className="flex items-center py-3 text-sm">
                <span>Time</span>
                <span className="ml-auto">
                  {doctor.IndianDate} At {data.slot}
                </span>
              </li>
              <li className="flex items-center ">
                <span>Do you Want to make VideoCall</span>

                <FcVideoCall
                  onClick={() => MakeVideoCall(user._id)}
                  className="w-12 text-2xl h-12 ml-auto cursor-pointer "
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
