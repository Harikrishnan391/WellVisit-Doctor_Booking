import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const DoctorOtp = () => {
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otp, setOtp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countDown, setCountdown] = useState(40);
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = startCountDown();

    return () => {
      clearInterval(timer);
    };
  });

  const urlSearchParams = new URLSearchParams(window.location.search);
  const email = urlSearchParams.get("email");
  const resetPassword = urlSearchParams.get("forgot-password");

  const handleInput = (e, nextInputRef, index) => {
    console.log(index, "index");
    const currentInput = e.target;
    const inputValue = currentInput.value;

    if (/^\d$/.test(inputValue)) {
      setOtp((prevOtp) => {
        const updatedOtp = [...prevOtp];

        updatedOtp[index] = inputValue;
        return updatedOtp;
      });

      if (inputValue.length === 1) {
        if (nextInputRef) nextInputRef.current.focus();
      }
    } else if (inputValue === "") {
      setOtp((prevOtp) => {
        const updatedOtp = [...prevOtp];

        updatedOtp[index] = "";

        return updatedOtp;
      });
    }
  };

  const startCountDown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(timer);
          setResendDisabled(false);
        }
        return prevCount - 1;
      });
    }, 1000);
    return timer;
  };

  const handleResendOtp = async (e) => {
    const { email } = JSON.parse(localStorage.getItem("DoctorData"));
    console.log(email,"resend Otp")
    try {
      const res = await fetch(`${BASE_URL}/doctors/resend-Otp`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      if (res.status == 200) {
        toast.success("OTP sent Successfully check Your email !!");
      }
      setResendDisabled(true);
      setCountdown(60);
      startCountDown();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    console.log(verificationCode, "verificationCode");

    try {
      if (!resetPassword) {
        const res = await fetch(`${BASE_URL}/auth/doctorVerifyOtp`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            verificationCode: verificationCode,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to verify OTP");
        }

        const data = await res.json();
        console.log(data);
        const { message, ...rest } = data;
        toast.success(message);
        navigate("/doctors/login");
      }
      else{
        const res = await fetch(`${BASE_URL}/doctors/reset-password`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            verificationCode: verificationCode,
          }),
        });
        console.log(res);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to verify Otp");
        }
        const data = await res.json();
        console.log(data, "dataaa");
        if (res?.status === 200) {
          toast.success(data.message);
          navigate("/doctors/reset-password");
        }
      }
    
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12 ">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl mb-10">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email </p>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  <div className="w-16 h-16 ">
                    <input
                      maxLength={1}
                      ref={inputRef1}
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) => handleInput(e, inputRef2, 0)}
                    />
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      maxLength={1}
                      ref={inputRef2}
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) => handleInput(e, inputRef3, 1)}
                    />
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      maxLength={1}
                      ref={inputRef3}
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) => handleInput(e, inputRef4, 2)}
                    />
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      ref={inputRef4}
                      maxLength={1}
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) => handleInput(e, null, 3)}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    {resendDisabled ? (
                      <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm ">
                        {loading ? (
                          <CircleLoader color="#ffffff" size={20} />
                        ) : (
                          "Verify Account"
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-gray-500 border-none text-white text-sm shadow-sm "
                      >
                        Verify Account
                      </button>
                    )}
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>
                      {resendDisabled
                        ? "Wait for new otp :- "
                        : "Didn't recieve code?"}
                    </p>
                    {resendDisabled ? (
                      countDown
                    ) : (
                      <p
                        className="flex flex-row items-center text-blue-600 cursor-pointer hover:underline"
                        rel="noopener noreferrer"
                        onClick={handleResendOtp}
                      >
                        Resend
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOtp;
