import React, { useState, useEffect } from "react";
import { BASE_URL, docToken } from "../../config";
import getAvailableDates from "../../hooks/DoctorFetchData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoRemoveCircle } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";

const TimeManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDates, setOpenDates] = useState([]);
  const [availableSlots, setAvailableslots] = useState([]);
  console.log(availableSlots, "open datesss");

  const { data, loading, error } = getAvailableDates(
    `${BASE_URL}/doctors/getAvailableDates`
  );


  useEffect(() => {
    if (error) {
      console.log("Error in Doctor profile fetching data");
    } else if (data && !loading) {
      setOpenDates(data);
    }
  }, [error, data, loading, openDates]);

  const backendDates = data;

  const parseBackendDates = (dates) => {
    return dates.map((dateStr) => new Date(dateStr));
  };

  const highlightDate = parseBackendDates(backendDates);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    console.log("date", date);

    const res = await fetch(
      `${BASE_URL}/doctors/getAvailableSlots/${date.toISOString()}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${docToken}`,
        },
      }
    );

    let result = await res.json();

    setAvailableslots(result.data);
  };

  const reFetchData = () => {
    console.log("ZZZZZZZZZZZZZ");
    handleDateChange(selectedDate);
  };

  const handleRemoveSlot = async (slot) => {
    try {
      const res = await fetch(
        `${BASE_URL}/doctors/removeSlots?selectedDate=${selectedDate.toISOString()}&slot=${slot}`,
        {
          method: "get",
          headers: {
            Authorization: `Bearer ${docToken}`,
          },
        }
      );

      let result = await res.json();
      console.log(result, "result");

      reFetchData();

      if (!res.ok) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <div className="mt-6">
        <DatePicker
          className="border"
          placeholderText="Select Date"
          showIcon
          selected={selectedDate}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          onChange={handleDateChange}
          filterDate={(date) => date.getDay() !== 0}
          isClearable
          highlightDate={highlightDate}
        />
      </div>

      {availableSlots?.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mt-12 w-[450px] text-center text-white">
          {availableSlots.map((slot, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-red-600  hover:bg-[#f72585] hover:scale-105 transition duration-100 ease-in-out cursor-pointer relative"
            >
              {slot}
              <button
                className="absolute top-[-8px] right-[4px] text-black text-[25px]"
                onClick={() => handleRemoveSlot(slot)}
              >
                {/* <IoRemoveCircle /> */}
                <TiDelete />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex ml-6">
          <h3>No slots opened yet!</h3>
        </div>
      )}
    </div>
  );
};

export default TimeManagement;
