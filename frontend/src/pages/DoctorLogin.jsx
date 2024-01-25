import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPatientCredentials } from "../slices/patientAuthSlice.js";
import { setDoctorCredentials } from "../slices/doctorAuthSlice.js";
import { PacmanLoader } from "react-spinners";

const DoctorLogin = () => {
  //State variables for Validation
  const [errors, setErrors] = useState({});
  const [isValid, setIsvalid] = useState(false);
  const navigate = useNavigate();
  const doctor = localStorage.getItem("doctorInfo");

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
              <a href="#" className="underline">
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
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                  required
                  className={`px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
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
              <div className="flex flex-col space-y-5">
                <span className="flex items-center justify-center space-x-2">
                  <span className="h-px bg-gray-400 w-14" />
                  <span className="font-normal text-gray-500">
                    or login with
                  </span>
                  <span className="h-px bg-gray-400 w-14" />
                </span>
                {/* <div className="flex flex-col space-y-4">
                  <a
                    href="#"
                    className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-gray-800 rounded-md group hover:bg-gray-800 focus:outline-none"
                  >
                    <span>
                      <svg
                        className="w-5 h-5 text-gray-800 fill-current group-hover:text-white"
                        viewBox="0 0 16 16"
                        version="1.1"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                        />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-800 group-hover:text-white">
                      Github
                    </span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-blue-500 rounded-md group hover:bg-blue-500 focus:outline-none"
                  >
                    <span>
                      <svg
                        className="text-blue-500 group-hover:text-white"
                        width={20}
                        height={20}
                        fill="currentColor"
                      >
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-blue-500 group-hover:text-white">
                      Twitter
                    </span>
                  </a>
                </div>. */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorLogin;
