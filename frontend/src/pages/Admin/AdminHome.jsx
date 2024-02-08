import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { BASE_URL, adminToken } from "../../config";
import userFetchData from "../../hooks/userFetchData";

const AdminHome = () => {
  const [chartBar, setChartBar] = useState(null);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [booking, setBookings] = useState([]);
  console.log(booking, "booking");

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/MonthlyBooking`, {
          method: "get",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        const result = await response.json();
        const data = result.data;
        console.log(data, "data");

        // Sort data by month ID in ascending order
        const sortedData = data.sort((a, b) => a._id - b._id);

        const labelsBarChart = sortedData.map((item) => {
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
          ];
          return monthNames[item._id - 1];
        });

        const backgroundColors = ["hsl(252, 82.9%, 67.8%)"];
        const dataBarChart = {
          labels: labelsBarChart,
          datasets: [
            {
              label: "Total Bookings",
              backgroundColor: backgroundColors,
              borderColor: backgroundColors,
              data: sortedData.map((item) => item.totalBookings),
            },
            {
              label: "Total Amount",
              backgroundColor: backgroundColors,
              borderColor: backgroundColors,
              data: sortedData.map((item) => item.totalAmount),
            },
          ],
        };

        const configBarChart = {
          type: "bar",
          data: dataBarChart,
          options: {
            scales: {
              x: {
                reverse: false,
              },
            },
          },
        };

        // If chartBar is already set, destroy it before creating a new one
        if (chartBar) {
          chartBar.destroy();
        }

        const newChartBar = new Chart(
          document.getElementById("chartBar"),
          configBarChart
        );
        setChartBar(newChartBar);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMonthlyData();
  }, []);

  const { data, error, loading, refetch } = userFetchData(
    `${BASE_URL}/admin/getAllUser`
  );

  useEffect(() => {
    if (error) {
      console.log(error);
    } else if (!error && !loading) {
      setUsers(data);
    }
  }, [error, loading, data]);

  //fetching doctor details

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/getAllDoctor`, {
          method: "get",
        });
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        } else {
          setDoctors(result.data);
        }
      } catch (error) {
        console.log(error, "error");
      }
    };

    fetchAllDoctors();
  }, []);

  useEffect(() => {
    const totalBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin/getBooking`, {
          method: "get",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        const result = await res.json();
        setBookings(result.data);

        console.log(result, "result from total Booking");
      } catch (error) {
        console.log(error, "error");
      }
    };
    totalBookings();
  }, []);

  return (
    <>
      <div className="fixed w-full z-30 flex bg-white dark:bg-[#0F172A] p-2 items-center justify-center h-16 px-10">
        <div className="logo ml-12 dark:text-white  transform ease-in-out duration-500 flex-none h-full flex items-center justify-center">
          Admin DashBoard
        </div>
        {/* SPACER */}
        <div className="grow h-full flex items-center justify-center" />
        <div className="flex-none h-full text-center flex items-center justify-center">
          <div className="flex space-x-3 items-center px-3">
            <div className="flex-none flex justify-center">
              <div className="w-8 h-8 flex ">
                {/* <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShta_GXR2xdnsxSzj_GTcJHcNykjVKrCBrZ9qouUl0usuJWG2Rpr_PbTDu3sA9auNUH64&usqp=CAU"
                  alt="profile"
                  className="shadow rounded-full object-cover"
                /> */}
              </div>
            </div>
            <div className="hidden md:block text-sm md:text-md text-black dark:text-white">
              Admin
            </div>
          </div>
        </div>
      </div>

      <div className="content ml-12 transform ease-in-out duration-500 pt-20 px-2 md:px-5 pb-4 ">
        <div className="flex flex-wrap my-5 -mx-2">
          <div className="w-full lg:w-1/3 p-2">
            <div className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-4">
              <div className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokewidth="{1.5}"
                  stroke="currentColor"
                  className="object-scale-down transition duration-500"
                >
                  <path
                    strokelinecap="round"
                    strokelinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                <div className="text-xs whitespace-nowrap">Total User</div>
                <div className="">{users.length > 0 ? users.length : "0"}</div>
              </div>
              <div className=" flex items-center flex-none text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokewidth="{1.5}"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokelinecap="round"
                    strokelinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-2 ">
            <div className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
              <div className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokewidth="{1.5}"
                  stroke="currentColor"
                  className="object-scale-down transition duration-500"
                >
                  <path
                    strokelinecap="round"
                    strokelinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                <div className="text-xs whitespace-nowrap">Total Doctors</div>
                <div className="">
                  {doctors.length > 0 ? doctors.length : "0"}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-2">
            <div className="flex items-center flex-row w-full bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3">
              <div className="flex text-indigo-500 dark:text-white items-center bg-white dark:bg-[#0F172A] p-2 rounded-md flex-none w-8 h-8 md:w-12 md:h-12 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokewidth="{1.5}"
                  stroke="currentColor"
                  className="object-scale-down transition duration-500"
                >
                  <path
                    strokelinecap="round"
                    strokelinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                  />
                </svg>
              </div>
              <div className="flex flex-col justify-around flex-grow ml-5 text-white">
                <div className="text-xs whitespace-nowrap">Total Bookings</div>
                <div className="">
                  {booking.length > 0 ? booking.length : "0"}
                </div>
              </div>
              <div className=" flex items-center flex-none text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokewidth="{1.5}"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokelinecap="round"
                    strokelinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="shadow-lg rounded-lg overflow-hidden">
          <div className="py-3 px-5 bg-gray-50">Monthly Sales</div>
          <canvas className="p-10" id="chartBar"></canvas>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
