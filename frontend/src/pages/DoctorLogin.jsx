import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPatientCredentials } from "../slices/patientAuthSlice.js";
import { setDoctorCredentials } from "../slices/doctorAuthSlice.js";
import { PacmanLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const DoctorLogin = () => {
  //State variables for Validation
  const [errors, setErrors] = useState({});
  const [isValid, setIsvalid] = useState(false);
  const navigate = useNavigate();
  const doctor = localStorage.getItem("doctorInfo");
  const [showPassword, setShowPassword] = useState(false); // State variable to track password visibility
  const [showDummyCredentials, setShowDummyCredentials] = useState(false);
  useEffect(() => {
    if (doctor) {
      navigate("/doctors/home");
    }
  });

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      delete errors.role;
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
        // credentials: "include",
        body: JSON.stringify(formData),
      });

      console.log("response from DoctorLogin", res);

      let result = await res.json();
      console.log("result", result);

      if (!res.ok) {
        throw new Error(result.message);
      }

      if (formData.role === "patient") {
        dispatch(setPatientCredentials(result.data));
      } else {
        console.log("its doctor");
        dispatch(setDoctorCredentials(result.data));
      }

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message);
        if (formData.role == "doctor") {
          navigate("/doctors/home");
        } else {
          navigate("/users/home");
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
    <>
      <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
        <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
          <div className="p-4 py-6 text-white bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
            <div className="my-3 text-4xl font-bold tracking-wider text-center">
              <a href="#">Well Visit</a>
            </div>
            <p className="mt-6 font-normal text-center text-gray-300 md:mt-0">
              "Healing starts with a click. Schedule today for better health."
            </p>
            <p className="flex flex-col items-center justify-center mt-10 text-center">
              <span>Don't have an account?</span>
              <a href="/doctors/doctorSignup" className="underline">
                Get Started!
              </a>
            </p>
          </div>
          <div className="p-5 bg-white md:flex-1 mb-40">
            <h3 className="my-4 text-2xl font-semibold text-gray-700">
              Doctor Login
            </h3>
            <form onSubmit={submitHandler} className="flex flex-col space-y-5">
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-500"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={FormData.email}
                  onChange={handleInputChange}
                  required
                  autofocus=""
                  className={`px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <div className="text-sm text-red-500">{errors.email}</div>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-500"
                  >
                    Password
                  </label>
                  <Link
                    to="/doctors/forgot-password"
                    className="text-sm text-blue-600 hover:underline focus:text-blue-800"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleInputChange}
                    required
                    className={`px-4 py-2  w-full  transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-sm text-red-500">{errors.password}</div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <label className="mr-4 text-sm text-slate-500">I am a:</label>
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
                </div>
                {errors.role && (
                  <div className="text-sm text-red-500">{errors.role}</div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                >
                  {loading ? (
                    <PacmanLoader color="#36D7B7" size={15} margin={2} />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
              {showDummyCredentials && (
                <div className="mt-4">
                  <h3 className="my-4 text-lg font-semibold text-gray-700">
                    Dummy Credentials for Testing
                  </h3>
                  <p>Username: arjun@gmail.com</p>
                  <p>Password: Arj@1234</p>
                </div>
              )}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline focus:text-red-800"
                  onClick={() => setShowDummyCredentials(!showDummyCredentials)}
                >
                  {showDummyCredentials
                    ? "Hide Dummy Credentials"
                    : "Show Dummy Credentials"}
                </button>
              </div>

              <div className="flex flex-col space-y-5">
                <span className="flex items-center justify-center space-x-2">
                  <span className="h-px bg-gray-400 w-14" />
                  <span className="font-normal text-gray-500">
                    or login with
                  </span>
                  <span className="h-px bg-gray-400 w-14" />
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorLogin;
