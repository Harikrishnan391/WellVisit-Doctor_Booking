import React, { useState, useEffect } from "react";
import doctorgetProfile from "../../hooks/DoctorFetchData";
import { BASE_URL } from "../../config";
import Error from "../../components/About/Error";
import Overview from "./Overview";
import DoctorProfileSettings from "./DoctorProfileSettings";
import TimeManagement from "./TimeManagement";
import TimeShedule from "./TimeShedule";
import ChangePassword from "./ChangePassword";

const DoctorsAccount = () => {
  const [tab, setTab] = useState("overview");

  const [userData, setUserData] = useState({});

  const { data, loading, error, refetch } = doctorgetProfile(
    `${BASE_URL}/doctors/getDoctorProfile`
  );

  useEffect(() => {
    if (error) {
      console.log("Error in Doctor profile fetching data");
    } else if (data && !loading) {
      setUserData(data);
    }
  }, [error, data, loading, userData]);

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto mt-0">
        {/* {loading && <Loader />} */}
        {error && <Error errorMessage={error.message} />}
        {!loading && !error && (
          <div className="grid gap-10 md:grid-cols-3">
            <div className="pb-[50px] px-[30px] rounded-md">
              <div className="mt-[50px] md:mt-[20px]  hidden md:block   ">
                <button
                  onClick={() => setTab("overview")}
                  className={` ${
                    tab === "overview"
                      ? "bg-primaryColor text-white w-full mb-2 rounded-md p-3 font-normal"
                      : "w-full bg-[#c0c3ca] text-black p-3 text-[16px] leading-7 mb-2 rounded-md"
                  } `}
                >
                  Overview
                </button>
                <button
                  onClick={() => setTab("timeShedule")}
                  className={` ${
                    tab === "timeShedule"
                      ? "bg-primaryColor text-white w-full mb-2 rounded-md p-3"
                      : "w-full bg-[#c0c3ca] text-black p-3 text-[16px] leading-7 mb-2 rounded-md"
                  } `}
                >
                  Time Shedule
                </button>
                <button
                  onClick={() => setTab("timeManagement")}
                  className={` ${
                    tab === "timeManagement"
                      ? "bg-primaryColor text-white w-full mb-2 rounded-md p-3"
                      : "w-full bg-[#c0c3ca] text-black p-3 text-[16px] leading-7 mb-2 rounded-md"
                  } `}
                >
                  Time Management
                </button>
                <button
                  onClick={() => setTab("profileSettings")}
                  className={` ${
                    tab === "profileSettings"
                      ? "bg-primaryColor text-white w-full mb-2 rounded-md p-3"
                      : "w-full bg-[#c0c3ca] text-black p-3 text-[16px] leading-7 mb-2 rounded-md"
                  } `}
                >
                  Profile Settings
                </button>

                <button
                  onClick={() => setTab("reset-password")}
                  className={` ${
                    tab === "reset-password"
                      ? "bg-primaryColor text-white w-full mb-2 rounded-md p-3"
                      : "w-full bg-[#c0c3ca] text-black p-3 text-[16px] leading-7 mb-2 rounded-md"
                  } `}
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="md col-span-2  md:px-[30px] ">
              <div className="md:hidden">
                <button
                  onClick={() => setTab("bookings")}
                  className={`${
                    tab === "bookings" &&
                    "bg-primaryColor text-white font-normal"
                  }    p-2  mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7  border
              border-solid border-primaryColor  `}
                >
                  Overview
                </button>

                <button
                  onClick={() => setTab("settings")}
                  className={` ${
                    tab === "settings" &&
                    "bg-primaryColor text-white font-normal"
                  }  p-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 mr-2  border
             border-solid border-primaryColor `}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setTab("settings")}
                  className={` ${
                    tab === "settings" &&
                    "bg-primaryColor text-white font-normal"
                  }  p-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7  border
            border-solid border-primaryColor `}
                >
                  Profile Settings
                </button>
              </div>

              {tab == "overview" && <Overview userData={userData} />}
              {tab == "timeShedule" && <TimeShedule />}
              {tab == "profileSettings" && (
                <DoctorProfileSettings refetch={refetch} data={data} />
              )}
              {tab == "timeManagement" && <TimeManagement />}
              {tab == "reset-password" && <ChangePassword />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsAccount;
