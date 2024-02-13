import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPatientCredentials } from "../slices/patientAuthSlice.js";
import HashLoader from "react-spinners/HashLoader.js";
import { setDoctorCredentials } from "../slices/doctorAuthSlice.js";
import OAuth from "../components/GoogleAuth/OAuth.jsx";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa"; // Import required icons fot input filed

const Login = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("PatientInfo");

  useEffect(() => {
    if (user) {
      navigate("/users/home");
    }
  }, []);
  //// Taking each values from Input field /////
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  //State variables for Validation
  const [errors, setErrors] = useState({});
  const [isValid, setIsvalid] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //// Function for password Visitbitlity
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //// code for Validation////
  const validateForm = () => {
    const errors = {};
    //validate email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!formData.email.match(emailRegex)) {
      errors.email = "Invalid email address";
    } else {
      delete errors.email;
    }

    //validate Password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!formData.password.match(passwordRegex)) {
      errors.password =
        "Password must contain atleast one uppercase letter ,one lowercase letter ,one number ,one special character,and be atleast 6 character long";
    } else {
      delete errors.password;
    }

    //validate type

    if (!formData.role) {
      errors.role = "Please select your type(Doctor/Patient)";
    } else {
      delete errors.type;
    }

    setErrors(errors);
    setIsvalid(Object.keys(errors).length === 0);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    validateForm();

    if (!isValid) {
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      if (formData.role == "patient") {
        dispatch(setPatientCredentials(result.data));
      } else {
        dispatch(setDoctorCredentials(result.data));
      }

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message);

        console.log(formData);
        if (formData.role === "doctor") {
          navigate("/doctors/home");
        } else {
          navigate("/users/home");
          // history.push("/users/home");
        }
      }, 1000);
    } catch (error) {
      console.log(error, "error");
      setTimeout(() => {
        toast.error(error.message);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <section>
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-2xl md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Hello <span className="text-primaryColor">Welcome </span>
          back
        </h3>
        <form className="py-4 md:py-0" onSubmit={submitHandler}>
          <div className="mb-5 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaEnvelope className="text-gray-500" />
            </span>
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16 px] loading-7 text-headingColor placeholder:text-textColor rounded-md ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <div className="text-sm text-red-500">{errors.email}</div>
            )}
          </div>

          {/* <div className="mb-5">
            <input
              type="Password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full   py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16 px] loading-7 text-headingColor placeholder:text-textColor rounded-md ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <button>
            {showPassword ? <FiEye />:<FiEyeOff />}
            </button>
          

            {errors.password && (
              <div className="text-sm text-red-500">{errors.password}</div>
            )}
          </div> */}
          <div className="mb-5 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-500" />
            </span>
            <input
              type={showPassword ? "text" : "password"} // Conditional rendering of input type
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16 px] loading-7 text-headingColor placeholder:text-textColor rounded-md ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {/* Icon for toggling password visibility */}
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <div className="text-sm text-red-500">{errors.password}</div>
            )}
            {errors.password && (
              <div className="text-sm text-red-500">{errors.password}</div>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <label className="mr-4 text-sm text-slate-500 font-semibold">
                I am a:
              </label>
              <label>
                <input
                  type="radio"
                  value="doctor"
                  name="role"
                  checked={formData.role === "doctor"}
                  onChange={handleInputChange}
                />
                Doctor
              </label>
              <label>
                <input
                  type="radio"
                  value="patient"
                  name="role"
                  checked={formData.role === "patient"}
                  onChange={handleInputChange}
                />
                Patient
              </label>
              <div className="ml-auto">
                <Link
                  to="/forgot-password"
                  className="text-primaryColor ml-20 "
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            {errors.role && (
              <div className="text-sm text-red-500">{errors.role}</div>
            )}
          </div>

          <div className="mt-7">
            <button
              type="submit"
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
            >
              {loading ? <HashLoader size={25} color="#fff" /> : " Login"}
            </button>
            <OAuth />

            <p className="mt-5 text-textColor text-center">
              Don&apos;t have an Account?
              <Link
                to="/register"
                className="text-primaryColor font-medium ml-1"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
