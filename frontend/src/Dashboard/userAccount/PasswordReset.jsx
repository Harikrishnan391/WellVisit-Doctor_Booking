import React, { useState } from "react";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { PacmanLoader } from "react-spinners";
import { logoutPatient } from "../../slices/patientAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [isValid, setIsvalid] = useState(false);

  const user = JSON.parse(localStorage.getItem("PatientInfo"));
  const formData = {
    currentPassword,
    newPassword,
    confirmPassword,
    email: user.email,
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(user.email, "email");
  const validateForm = () => {
    const errors = {};

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!formData.currentPassword.match(passwordRegex)) {
      errors.currentPassword =
        "Password must contain atleast one uppercase letter ,one lowercase letter ,one number ,one special character,and be atleast 6 character long";
    } else if (!formData.newPassword.match(passwordRegex)) {
      errors.newPassword =
        "Password must contain atleast one uppercase letter ,one lowercase letter ,one number ,one special character,and be atleast 6 character long";
    } else if (!formData.confirmPassword.match(passwordRegex)) {
      errors.confirmPassword =
        "Password must contain atleast one uppercase letter ,one lowercase letter ,one number ,one special character,and be atleast 6 character long";
    } else {
      delete errors.confirmPassword;
    }
    setErrors(errors);
    setIsvalid(Object.keys(errors).length === 0);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${BASE_URL}/users/changePassword`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { error, message } = await res.json();

      if (error) {
        setError(error);
        toast.error(error);
      } else {
        toast.success("password Reset Successfully");
        setTimeout(() => {
          dispatch(logoutPatient());
          navigate("/users/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setError(
        "An error occurred while changing the password. Please try again."
      );
      toast.error(
        "An error occurred while changing the password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center ml-12 justify-center h-screen">
        <div className="bg-white p-8 py-12 rounded-lg mb-12 shadow-lg max-w-sm w-full mt-[-100px]">
          <div className="flex items-center space-x-4 mb-6">
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
            <div>
              <label
                htmlFor="currentPassword"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Current Password *
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
                className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                New Password *
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
                required=""
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input form-input block border w-full border-gray-300 rounded-md shadow-sm"
                required=""
              />
              <button
                type="button"
                onclick="clearConfirmPassword()"
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                Clear
              </button>
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
                {loading ? (
                  <PacmanLoader color="#36D7B7" size={15} margin={2} />
                ) : (
                  "ResetPassword"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
