import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config.js";
// import { setDoctorCredentials } from "../slices/DoctorAuthSlice.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const DoctorResetPassword = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Password not match");
    }

    const user = JSON.parse(localStorage.getItem("DocotorData"));
    console.log(user, "userr");

    if (!user) {
      toast.error("Error occured while processing credential Provide mail");
      return navigate("/doctors/forgot-password");
    }
    const { email } = user;
    console.log(email);
    try {
      const res = await fetch(`${BASE_URL}/doctors/DoctorResetPassword`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const { status, ...rest } = res;
      localStorage.removeItem("DocotorData")

      if (res?.status == 200) {
        toast.success("Password Updated Successfully");
        navigate("/users/login");
      }
    } catch (error) {

      console.log(error, "erroor");
    }
  };
  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex items-center space-x-2 mb-6">
          <img
            src="https://unsplash.it/40/40?image=883"
            alt="Lock Icon"
            className="rounded-full"
          />
          <h1 className="text-xl font-semibold">Change Password</h1>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Update password for enhanced account security.
        </p>
        <form
          id="changePasswordForm"
          className="space-y-6"
          onSubmit={submitHandler}
        >
          {/* <div>
        <label
          htmlFor="currentPassword"
          className="text-sm font-medium text-gray-700 block mb-2"
        >
          Current Password *
        </label>
        <input
          type="password"
          id="currentPassword"
          className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
          required=""
        />
      </div> */}
          <div>
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              New Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
              required=""
              placeholder="**********"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Confirm New Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="password-input form-input block border w-full border-gray-300 rounded-md shadow-sm"
              required=""
              placeholder="***********"
              value={confirmPassword}
              autoComplete="false"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onclick="discardChanges()"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorResetPassword;
