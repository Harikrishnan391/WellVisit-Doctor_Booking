import React, { useState } from "react";
import DatePicker from "react-datepicker";
import BeatLoader from "react-spinners/BeatLoader";
import { BASE_URL, docToken } from "../../config";
import "react-datepicker/dist/react-datepicker.css";
import {toast} from "react-toastify"

const TimeShedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showGrid, setShowGrid] = useState(false);
  const [selectedGrid, setselectedGrid] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleToggle = () => {
    setShowGrid(!showGrid);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (selectedGrid.length > 0) {
      const confirmChange = window.confirm(
        "You have unsaved changes. Are you Sure want to change the  date without submitting?"
      );
    }

    if (!confirmChange) {
      return;
    }
    setselectedGrid([]);
    setSelectedDate(date);
  };

  const handleGridClick = (value) => {
    if (selectedGrid.includes(value)) {
      setselectedGrid(selectedGrid.filter((item) => item !== value));
    } else {
      setselectedGrid([...selectedGrid, value]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const newScheduleItem = {
      date: new Date(selectedDate),
      slots: selectedGrid,
    };

    try {
      const res = await fetch(`${BASE_URL}/doctors/addTimeSlots`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${docToken}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify({data:newScheduleItem})
      });

      let result=await res.json()

      if(!res.ok){
        throw new Error(result.meesage)
      }

      setTimeout(()=>{
        setLoading(false)
        setselectedGrid([])
        toast.success(result.message)
      },1000)
      
    } catch (error) {
      console.log("error", error);
      setTimeout(() => {
        toast.error(error.message);
        setLoading(false);
      }, 1000);
    }


  };
  return (
    
    <div className="mt-4">
      <DatePicker
        className="border"
        placeholderText="Select Date"
        showIcon
        selected={selectedDate}
        dateFormat="dd/MM/yyyy"
        minDate={new Date()}
        filterDate={(date) => date.getDay() !== 0}
        isClearable
        onChange={handleDateChange}
      />



      <div>
        <button
          onClick={handleToggle}
          className="p-2 mt-6 rounded bg-[#dd3a25] text-white hover:bg-[#660f56]"
        >
          Select Time Slots
        </button>
      </div>

      {showGrid && (
        <div>
          <div className="grid grid-cols-3 gap-4 mt-6  w-[450px] text-center text-white">
            {[
              "10 am to 11 am",
              "11 am to 12 am",
              "12 pmx to 1 pm",
              "1 am to 2 pm",
              "2 am to 3 pm",
              "4 am to 5 pm",
              "5 am to 6 pm",
              "6 am to 7 pm",
            ].map((value) => (
              <div
                key={value}
                onClick={() => handleGridClick(value)}
                className={`${
                  selectedGrid.includes(value)
                    ? "bg-[#4e7a78] p-3 rounded-lg hover:scale-105 transition duration-100 ease-in-out cursor-pointer"
                    : "p-3 rounded-lg bg-red-500 hover:bg-[#72585] hover:scale-105 transition duration-100 ease-in-out cursor-pointer"
                }
                 `}
              >
                {value}{""}
              </div>
            ))}
          </div>

          <div
            onClick={handleSubmit}
            className="bg-green-500 rounded-lg text-white mt-6 w-[100px] p-2 text-center hover:scale-105 transition duration-100 ease-in-out cursor-pointer"
          >
            {loading ? (
              <BeatLoader color={"#ffff"} sizeUnit={"5px"} />
            ) : (
              "Submit"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeShedule;
