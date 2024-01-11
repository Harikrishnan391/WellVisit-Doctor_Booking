import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import uploadImageCloudinary from "../../utils/uploadCloudinary.js";
import { BASE_URL, token } from "../../config.js";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const Profile = ({ user }) => {
  // const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    gender: "male",
    bloodType: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      number: user.number,
      gender: user.gender,
      bloodType: user.bloodType,
    });
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleFileInputChange = async (event) => {
  //   const file = event.target.files[0];

  //   const data = await uploadImageCloudinary(file);
  //   // console.log(data);
  // };

  const submitHandler = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    console.log("formDataToSend", [...formDataToSend.entries()]);

    console.log("formData", formData);
    try {
      const res = await fetch(`${BASE_URL}/users/updateUser/${user._id}`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${token} `,
          "Content-Type": "multipart/form-data",
        },
        // body: JSON.stringify({ data: formData })
        body: formDataToSend,
      });

      let result = await res.json();
      console.log("result", result.message);

      if (!res.ok) {
        throw new Error(result.message);
      }

      setLoading(false);
      toast.success(result.message);
    } catch (error) {
      console.log("error", error);

      setTimeout(() => {
        toast.error(error.message);
        setLoading(false);
      }, 1000);
    }
  };
  return (
    <section className="h-fit  flex flex-col mt-[-20] md:flex-row justify-start space-y-10 md:space-y-0 md:space-x-16  my-2 mx-5 md:mx-0 md:my-0 lg:mt-[-20px] mb-[6.5rem]">
      <div className="max-w-md md:w-[100%] flex flex-col items-start ">
        <div className="my-5 items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300"></div>

        <input
          className="w-full px-4 py-2 text-sm border border-gray-300 border-solid rounded"
          type="text"
          placeholder="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />

        <input
          className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
          type="email"
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
          type="number"
          placeholder="Mobile Number"
          name="number"
          value={formData.number}
          onChange={handleInputChange}
        />
        <input
          className="w-full hidden px-4 py-2 mt-4 text-sm border border-gray-300 border-solid rounded"
          type="password"
          placeholder=" Type your new password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <select
          className="w-full px-4 py-2 mt-4 text-sm border border-gray-300 rounded"
          name="bloodType"
          value={formData.bloodType}
          onChange={handleInputChange}
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <div className="flex justify-between px-1 mt-4 text-sm ">
          <div>
            <label htmlFor="type">Gender : </label>
            <select
              name="gender"
              id="type"
              value={formData.gender}
              onChange={handleInputChange}
              className="px-2 py-1 leading-tight text-gray-500 focus:outline-none focus:shadow-outline"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="text-center md:text-left  ">
          <button
            //disabled={loading && true}
            onClick={submitHandler}
            className="w-full px-4 py-2 mt-4 text-xs tracking-wider text-white uppercase bg-blue-600 rounded hover:bg-blue-700 "
            type="submit"
          >
            {loading ? (
              <HashLoader color="#ffffff" margin={3} size={8} />
            ) : (
              " Update"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
