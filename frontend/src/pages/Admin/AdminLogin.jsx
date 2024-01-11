import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config.js";
import { useDispatch } from "react-redux";
import adminImg from "../../assets/images/admin.jpg"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAdminCredentials } from "../../slices/adminAuthSlice.js";

import BeatLoader from "react-spinners/BeatLoader";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    const admin=localStorage.getItem("adminInfo")

    if(admin){
      navigate("/admin/users")
    }
  })

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      let result = await res.json();
      console.log(result);

      if (!res.ok) {
        throw new Error(result.message);
      }

      dispatch(setAdminCredentials(result));

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message);
        navigate("/admin/users");
      }, 1000);
    } catch (err) {
      console.log("error", err);
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0 lg:mt-[-60px] mb-[6.5rem]">
      <div className="max-w-sm md:w-1/3">
        <img src={adminImg} alt="Smaple image" />
      </div>
      <div className="max-w-sm md:w-1/3">
        <div className=" my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 font-semibold text-center text-slate-500">
            Admin Login
          </p>
        </div>
        <form onSubmit={submitHandler}>
          <input
            className={`text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded`}
            type="text"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
          />

          <input
            className={`text-sm w-full mt-5 px-4 py-2 border border-solid border-gray-300 rounded`}
            type="password"
            value={formData.password}
            placeholder="password"
            onChange={handleInputChange}
            name="password"
          />

          <div className="flex justify-between mt-4 text-sm font-semibold"></div>
          <div className="text-center md:text-center">
            <button
              className="px-4 py-2 mt-4 text-center tex-sm tracking-wider text-white uppercase bg-blue-600 rounded hover:bg-blue-700"
              type="submit"
            >
              {loading ? <BeatLoader /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
