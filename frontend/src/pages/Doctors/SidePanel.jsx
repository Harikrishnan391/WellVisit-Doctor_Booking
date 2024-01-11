import React, { useState } from "react";
import { BASE_URL, token } from "../../config";
import DatePicker from "react-datepicker";
import PayButton from "../../components/PayButton/PayButton";

const SidePanel = (details) => {
  const [date, setDate] = useState(new Date());
  const [openDates, setOpenDates] = useState([]);
  const [showSlots, setShowSlots] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  const getAvailableDates = async () => {
    const res = await fetch(
      `${BASE_URL}/users/getAvailableDates/${details.details._id}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let result = await res.json();
    setOpenDates(result.data);
  };

  const parseBackendDates = (dates) => {
    return dates.map((dateStr) => new Date(dateStr));
  };

  const highlightDates = parseBackendDates(openDates);

  const handleChange = (date) => {
    setDate(date);
    setShowSlots(false);
  };

  const searchSlots = async () => {
    const res = await fetch(
      `${BASE_URL}/users/getAvailableSlots?date=${date.toISOString()}&doctor=${
        details.details._id
      }`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let result = await res.json();
    console.log("resutl", result);
    setShowSlots(true);
    setSlots(result.data);
  };

  return (
    <div className="shadow-panelShadow p-3 lg:p-5  rounded-md">
      <div className="flex items-center justify-between py-2">
        <p className="text_para mt-0 font-semibold"> Fees for Consultation:</p>
        <span className="text-[16px]  leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {details.details.fee}
        </span>
      </div>
      <div className="mt-[30px]">
        <p className="text_para mt-0 font-semibold text-headingColor">
          Select available Date
        </p>
        <DatePicker
          className="border border-solid-black"
          placeholderText="select a date "
          showIcon
          dateFormat="dd/MM/yyyy"
          selected={date}
          filterDate={(date) => date.getDay() !== 0}
          minDate={new Date()}
          onChange={handleChange}
          isClearable
          onFocus={() => getAvailableDates()}
          highlightDates={highlightDates}
        />

        <button
          onClick={() => searchSlots()}
          className="mt-3 bg-teal-400 text-white rounded-md p-2 hover:scale-105 transition duration-100 ease-in-out cursor-pointer "
        >
          Search slots
        </button>
        {showSlots && slots?.length > 0 ? (
          <div className="grid grid-cols-2  gap-4 mt-12 w-[300px] text-center text-white">
            {slots.map((slot, index) => (
              <div
                onClick={() => setSelectedTime({ slot })}
                className={`${
                  selectedTime.slot === slot
                    ? "bg-[#f72585] border-[1.5px] border-blacl p-3 rounded-lg hover-bg-[#f72585] hover:scale-105  transition duration-100 ease-in-out  cursor-pointer relative"
                    : "p-3 rounded-lg bg-violet-500 hover-bg-[#f72585] hover:scale-105 transition duration-100 ease-in-out cursor-pointer relative"
                }`}
              >
                {slot}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {/* <button className="btn px-2 w-full rounded-md">Book Appointment</button> */}
      <PayButton
        docDetails={details}
        date={date}
        slot={selectedTime.slot}
        disabled={!slots}
      />
    </div>
  );
};

export default SidePanel;
