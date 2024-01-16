// import React, { useState } from "react";
// import { BASE_URL } from "../../config.js";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import BeatLoader from "react-spinners/BeatLoader";

// const DoctorOtp = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     code1: "",
//     code2: "",
//     code3: "",
//     code4: "",
//     code5: "",
//     code6: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };
//   console.log("formDataOtp", formData);

//   const storedDataString = localStorage.getItem("doctorSignUpData");
//   const storedData = JSON.parse(storedDataString);
//   console.log("storedData", storedData);
//   const number = storedData.formData.number;
//   let lastThree = number.slice(-3);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const combinedOtp = Object.values(formData).join("").toString();
//     console.log(combinedOtp);
//     const data = {
//       storedData: storedData,
//       otp: combinedOtp,
//     };
//     console.log(data);
//     try {
//       setLoading(true);
//       const res = await fetch(`${BASE_URL}/auth/doctorVerifyOtp`, {
//         method: "post",
//         headers: {
//           "Content-Type": "application/json",
//           credentials: "include",
//         },
//         body: JSON.stringify(data),
//       });

//       let result = await res.json();
//       console.log("resultOtp", result);

//       if (!res.ok) {
//         throw new Error(result.message);
//       }

//       localStorage.removeItem("doctorSignupData");
//       console.log("loading", loading);

//       setTimeout(() => {
//         toast.success(result.message);
//         navigate("/doctors/login");
//       }, 100);
//     } catch (error) {
//       setLoading(false);
//       setTimeout(() => {
//         toast.error("invalid OTP", error);
//       }, 1000);
//     }
//   };

//   return (
//     <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
//       <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
//         <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
//           <div className="flex flex-col items-center justify-center text-center space-y-2">
//             <div className="font-semibold text-3xl">
//               <p>OTP Verification</p>
//             </div>
//             <div className="flex flex-row text-sm font-medium text-gray-400">
//               <p>We have sent a code to your email ba**@dipainhouse.com</p>
//             </div>
//           </div>
//           <div>
//             <form action="" method="post">
//               <div className="flex flex-col space-y-16">
//                 <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
//                   <div className="w-16 h-16 ">
//                     <input
//                       className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
//                       type="text"
//                       maxLength={1}
//                       value={formData.code1}
//                       name="code1"
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div className="w-16 h-16 ">
//                     <input
//                       className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
//                       type="text"
//                       name="code2"
//                       maxLength={1}
//                       value={formData.code2}
//                       onChange={handleInputChange}
//                       id=""
//                     />
//                   </div>
//                   <div className="w-16 h-16 ">
//                     <input
//                       className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
//                       type="text"
//                       name="code3"
//                       maxLength={1}
//                       value={formData.code3}
//                       onChange={handleInputChange}
//                       id=""
//                     />
//                   </div>
//                   <div className="w-16 h-16 ">
//                     <input
//                       className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
//                       type="text"
//                       name="code4"
//                       maxLength={1}
//                       value={formData.code4}
//                       onChange={handleInputChange}
//                       id=""
//                     />
//                   </div>

//                   <div className="w-16 h-16 ">
//                     <input
//                       className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
//                       type="text"
//                       name="code5"
//                       maxLength={1}
//                       value={formData.code5}
//                       onChange={handleInputChange}
//                       id=""
//                     />
//                   </div>
//                   <div className="w-16 h-16 ">
//                     <input
//                       className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
//                       type="text"
//                       name="code6"
//                       maxLength={1}
//                       value={formData.code6}
//                       onChange={handleInputChange}
//                       id=""
//                     />
//                   </div>
//                 </div>
//                 <div className="flex flex-col space-y-5">
//                   <div>
//                     <button
//                       className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
//                       onClick={handleSubmit}
//                     >
//                       Verify Account
//                     </button>
//                   </div>
//                   <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
//                     <p>Didn't recieve code?</p>{" "}
//                     <a
//                       className="flex flex-row items-center text-blue-600"
//                       href="http://"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       Resend
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorOtp;

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
  const [countDown, setCountdown] = useState(0);
  console.log(otp, "otp");

  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();
  const navigate=useNavigate()

  const urlSearchParams=new URLSearchParams(window.location.search)
  const email=urlSearchParams.get("email")
  const resetPassword=urlSearchParams.get("forgot-password")

  console.log(resetPassword,"resetPassword")

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const verificationCode = otp.join("");

    try {

      if(!resetPassword){

        const res=await fetch(`${BASE_URL}/auth/doctorVerifyOtp`,{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            email:email,
            verificationCode:verificationCode,
          })
        })

        if(!res.ok){
          const data=await res.json()
          throw new Error(data.message||"Failed to verify OTP")
        }

        const data=await res.json()
        const {message,...rest}=data
        toast.success(message)
        navigate("/doctors/login")
      }
      const res=await fetch(`${BASE_URL}/doctors/reset-password`,{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email:email,
          verificationCode:verificationCode

        })
      })
      console.log(res)
      if(!res.ok){
        const data=await res.json()
        throw new Error(data.message||"Failed to verify Otp")
      }
      const data=await res.json()
      console.log(data,"dataaa")
      if(res?.status===200){
        toast.success(data.message)
        navigate("/doctors/reset-password")
      }

    } catch(error) {
      console.log(error)
      toast.error(error?.data?.message||error.message)
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
