import React from "react";
import { BASE_URL, token } from "../../config";

const PayButton = ({ docDetails, date, slot }) => {
  const user = JSON.parse(localStorage.getItem("PatientInfo"));

  const bookingData = {
    user: user,
    doctor: docDetails,
    date: date,
    slot: slot,
  };

  const handlePayment = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/makePayment`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user: user,
          doctor: docDetails,
          date: date,
          slot: slot,
        }),
      });

      if (res.ok) {
        localStorage.setItem("bookingData", JSON.stringify(bookingData));
        const data = await res.json();

        console.log(data.url, "url after payment ");
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        console.error("Request failed with status", res.status);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };
  return (
    <div>
      <button
        className={`w-full px-2 rounded-md btn  `}
        onClick={() => handlePayment()}
        disabled={!slot}
      >
        Click Here to Pay
      </button>
    </div>
  );
};

export default PayButton;
