import { useState } from "react";
import userImg from "../../assets/images/doctor-img01.png";
import MyBookings from "./MyBookings";
import Profile from "./Profile";
import useGetProfile from "../../hooks/userFetchData";
import { BASE_URL, type } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import PasswordReset from "./PasswordReset";

const MyAccount = () => {
  // const { dispatch } = useContext(authContext);
  const [tab, setTab] = useState("bookings");
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (isOpen) => {
    setModalOpen(isOpen);
  };

  const {
    data: userData,
    loading,
    error,
    refetch,
  } = useGetProfile(`${BASE_URL}/users/userProfile`, type);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loading />}

        {error && !loading && <Error errMessage={error} />}
        {!loading && !error && (
          <div className="grid  md:grid-cols-3 gap-10 ">
            <div className="pb-[50px] px-[30px] rounded-md">
              <div className="flex itmes-center justify-center">
                <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                  <img
                    src={userImg}
                    alt=""
                    className=" w-full h-full rounded-full"
                  />
                </figure>
              </div>
              <div className="text-center mt-4 ">
                <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                  {userData.name}
                </h3>
                <p className="text-textColor text-[15px] leading-6  font-medium">
                  {userData.email}
                </p>
                <p className="text-textColor text-[15px] leading-6  font-medium">
                  BloodType:
                  <span className="ml-2 text-headingColor text-[22px] leading-8">
                    {userData.bloodType}
                  </span>
                </p>
              </div>
              <div className="mt-[50px] md:mt-[100px] ">
                <div>
                  <button 
                  onClick={()=>setTab("password-reset")}
                  className="w-full   bg-[#3568ce] p-3 text-[16px] leading-7  rounded-md  text-white ">
                    Change Your Password

                  </button>
                  <button
                    className="w-full   bg-red-600 mt-4 p-3 text-[16px] leading-7  rounded-md text-white"
                    onclick="openModal(true)"
                  >
                    Delete Account{" "}
                  </button>
             
                </div>
              </div>
            </div>

            <div className="md:col-span-2  md:px-[30px]">
              <div>
                <button
                  onClick={() => setTab("bookings")}
                  className={`${
                    tab === "bookings" &&
                    "bg-primaryColor text-white font-normal"
                  } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border  border-solid border-primaryColor`}
                >
                  MY Bookings
                </button>
                <button
                  onClick={() => setTab("settings")}
                  className={`${
                    tab === "settings" &&
                    "bg-primaryColor text-white font-normal"
                  } p-2 py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
                >
                  Profile settings
                </button>
              </div>
              {tab === "bookings" && <MyBookings />}
              {tab === "settings" && (
                <Profile user={userData} refetch={refetch} />
              )}
              {tab === "password-reset" && <PasswordReset /> }
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAccount;
