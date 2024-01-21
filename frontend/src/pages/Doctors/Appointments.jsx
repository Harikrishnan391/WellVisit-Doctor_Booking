import React, { useState, useEffect } from "react";
import DoctorFetchData from "../../hooks/DoctorFetchData";
import { BASE_URL, docToken } from "../../config";
const path = "http://localhost:5000/userMedia/";

const Appointments = () => {
  const [Appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(6);
  const { error, loading, data, refetch } = DoctorFetchData(
    `${BASE_URL}/doctors/getMyAppointments`
  );

  useEffect(() => {
    if (error) {
      console.log(error);
    } else {
      setAppointments(data);
    }
  }, [Appointments, data, loading]);

  console.log(data, "from doctorFetch");

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentAppointments = Appointments.slice(firstPostIndex, lastPostIndex);

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
                  <th className="px-4 py-3">Action</th>
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
                        <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm">
                          {" "}
                          Acceptable{" "}
                        </span>
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
