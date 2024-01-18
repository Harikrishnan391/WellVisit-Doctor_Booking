import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import {toast} from "react-toastify"

const DoctorForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    console.log(e);

    e.preventDefault();
    try {
      const res=await fetch(`${BASE_URL}/doctors/forgot-password`,{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            email:email
        })
    
    })

    const data=await res.json()
    console.log(data,"response")

    if(res?.status===200){

      toast.success("check your mail for vefification code ")
      console.log(localStorage.setItem("DoctorData",JSON.stringify(data.doctorData)))
      navigate(`/doctors/doctorOtp?email=${email}&forgot-password=${true}`)
    }
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message||error.message)
    }
  };
  return (
    <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Remember your password?
              <a
                className="text-blue-600 decoration-2 hover:underline font-medium"
                href="#"
              >
                Login here
              </a>
            </p>
          </div>
          <div className="mt-5">
            <form onSubmit={submitHandler}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      required=""
                      placeholder="example@gmail.com"
                      aria-describedby="email-error"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="email-error"
                  >
                    Please include a valid email address so we can get back to
                    you
                  </p>
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  Reset password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DoctorForgotPassword;
