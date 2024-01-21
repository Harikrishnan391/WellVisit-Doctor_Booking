import React, { useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BASE_URL, docToken } from "../../config";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";

const DoctorProfileSettings = ({ data, refetch }) => {
  console.log(data, "data");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState(data.password);
  const [phoneNumber, setPhoneNumber] = useState(data.number);
  const [bio, setBio] = useState(data.bio);
  const [gender, setGender] = useState(data.gender);
  const [specialization, setSpecialization] = useState(data.specialization);
  const [fee, setFee] = useState(data.fee);

  const submitHandler = async (e) => {
    e.preventDefault();

    const dataToUpdate = {
      name,
      email,
      password,
      phoneNumber,
      bio,
      gender,
      specialization,
      fee,
    };

    console.log(dataToUpdate, "THe datas to Update.....");

    setLoading(true);
    try {
      // const formDataToSend=new FormData()

      // for(const key in dataToUpdate){
      //   formDataToSend.append(key,dataToUpdate[key])
      // }

      const res = await fetch(`${BASE_URL}/doctors/updateDoctor/${data._id}`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${docToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!res.ok) {
        throw new Error(result.message);
      }

      setTimeout(() => {
        setLoading(false);
        toast.success(result.message);
      }, 2000);

      refetch();
    } catch (error) {
      setTimeout(() => {
        toast.error(error.message);
        setLoading(false);
      }, 1000);
    }
  };
  return (
    <>
      <section className="max-w-4xl p-6  mt-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800 mt-20">
        <h1 className="text-xl font-bold text-white capitalize dark:text-white">
          Account settings
        </h1>
        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="username"
              >
                Name
              </label>
              <input
                id="username"
                type="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              />
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="emailAddress"
              >
                Email Address
              </label>
              <input
                name="floatemailing_password"
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              />
            </div>
            <div>
              <label className="text-white dark:text-gray-200">
                Phone number
              </label>
              <input
                name="number"
                id="number"
                type="number"
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="passwordConfirmation"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                type="text"
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                defaultValue={""}
              />
            </div>

            <div>
              <label className="text-white dark:text-gray-200">gender</label>
              <select
                name="gender"
                id="gender"
                onChange={(e) => setGender(e.target.value)}
                value={gender}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              >
                <option value="" disabled selected>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="specialization"
              >
                Specialization
              </label>
              <select
                name="specialization"
                id="specialization"
                onChange={(e) => setSpecialization(e.target.value)}
                value={specialization}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              >
                <option value="" disabled selected>
                  Select specialization
                </option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="pediatrician">pediatrician</option>
                <option value="phychiatrist">phychiatrist</option>
              </select>
            </div>

            <div>
              <label className="text-white dark:text-gray-200">Fee</label>
              <input
                name="fee"
                id="fee"
                type="number"
                onChange={(e) => setFee(e.target.value)}
                value={fee}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              />
            </div>

            <div className="flex items-center justify-center gap-7">
              {/* /////////////////////photo upload///////////////////// */}
              {/* <div className="flex flex-col items-center gap-3 mb-5 mt-7">
                {photo && (
                  <figure className=" w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center ">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt=""
                      className="w-full rounded-full"
                    />
                  </figure>
                )}

                <div className="relative w-[160px] h-[50px]  ">
                  <input
                    type="file"
                    name="photo"
                    id="photo"
                    onChange={handlePhotoInputChange}
                    accept=".jpg,.png"
                    className="absolute top-0 left-0 h-full opacity-0 cursor-pointer"
                  />
                  <label
                    htmlFor="photo"
                    className="absolute top-0 left-0 w-full h-fullflex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor 
                    font-semibold rounded-lg truncate cursor-pointer flex justify-center "
                  >
                    Upload Photo
                  </label>
                </div>
              </div> */}

              {/* /////////////////////ceritificate upload///////////////////// */}

              {/* <div className="flex flex-col items-center gap-3 mb-5 mt-7">
                {certificate?.map((certificate, index) => (
                  <figure
                    key={index}
                    className="w-[60px] h-[60px]  border-2 border-solid border-primaryColor flex items-center justify-center"
                  >
                    <img
                      src={URL.createObjectURL(certificate)}
                      alt={`Certificate ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                ))}

                <div className="relative w-[160px] h-[50px]  ">
                  <input
                    type="file"
                    name="certificate"
                    id="certificate"
                    onChange={handleCertificateInputChange}
                    accept=".jpg,.png"
                    multiple
                    className="absolute top-0 left-0 h-full opacity-0 cursor-pointer"
                  />
                  <label
                    htmlFor="certificate"
                    className="absolute top-0 left-0 w-full h-fullflex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor 
                    font-semibold rounded-lg truncate cursor-pointer flex justify-center "
                  >
                    Upload Certificate
                  </label>
                </div>
              </div> */}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600"
            >
              Save
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default DoctorProfileSettings;
