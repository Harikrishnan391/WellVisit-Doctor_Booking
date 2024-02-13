import React, { useState } from "react";
import { RiDeleteBin6Fill, RiPictureInPictureExitLine } from "react-icons/ri";
import { BASE_URL, docToken } from "../../config";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";
import uploadImageCloudinary from "../../utils/uploadCloudinary";
import { setDoctorCredentials } from "../../slices/doctorAuthSlice";
import { useDispatch } from "react-redux";

const DoctorProfileSettings = ({ data, refetch }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState(data.password);
  const [phoneNumber, setPhoneNumber] = useState(data.number);
  const [bio, setBio] = useState(data.bio);
  const [gender, setGender] = useState(data.gender);
  const [specialization, setSpecialization] = useState(data.specialization);
  const [fee, setFee] = useState(data.fee);
  const [photo, setPhoto] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [formData, setFormData] = useState({});
  const [about, setAbout] = useState(data.about);
  const [previewURL, setPreviewURL] = useState("");
  const [certificatepreviewURL, setCertificatePreviewURL] = useState("");
  const [validationError, setValidationError] = useState("");
  // Existing state variables...
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  console.log(education, "education");
  console.log(experience, "experience");

  const dispatch = useDispatch();

  const handlePhotoInputChange = async (e) => {
    const pic = e.target.files[0];
    const data = await uploadImageCloudinary(pic);
    console.log(data, "cloudinary image");
    setPreviewURL(data.url);
    setPhoto(data.url);
  };
  const handleCertificateInputChange = async (e) => {
    const certificate = e.target.files[0];
    const filesArray = Array.from(certificate);
    try {
      const uploadCertificates = await Promise.all(
        filesArray.map(async (file) => await uploadImageCloudinary(file))
      );
      // Assuming uploadCertificates is an array of objects with URLs
      const certificateUrls = uploadCertificates.map((cert) => cert.url);
      console.log(certificateUrls, "urls");
      setCertificatePreviewURL(certificateUrls);

      setCertificate(certificateUrls);
    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleCertificateInputChange = (e) => {
  //   const certificate = e.target.files;
  //   const filesArray = Array.from(certificate);
  //   setCertificate(filesArray);
  // };

  const addEducation = () => {
    const newEducation = {
      start: "",
      end: "",
      course: "",
      college: "",
    };
    setEducation([...education, newEducation]);
  };

  const addExperience = () => {
    const newExperience = {
      start: "",
      end: "",
      position: "",
      department: "",
    };
    setExperience([...experience, newExperience]);
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const updateExperience = (index, field, value) => {
    const updatedExperience = [...experience];
    updatedExperience[index][field] = value;
    setExperience(updatedExperience);
  };

  const removeEducation = (index) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
  };

  const removeExperience = (index) => {
    const updatedExperience = [...experience];
    updatedExperience.splice(index, 1);
    setExperience(updatedExperience);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const dataToUpdate = {
      name,
      email,
      phoneNumber,
      bio,
      gender,
      specialization,
      fee,
      about,
    };

    // Validation checks
    if (!name.trim() || /\d/.test(name)) {
      toast.error("Invalid name");
      return;
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email");
      return;
    }

    if (!bio.trim() || bio.split(/\s+/).length > 50) {
      toast.error("Invalid bio");
      return;
    }

    if (!gender || !specialization || !fee) {
      toast.error("Gender, specialization, and fee are required");
      return;
    }

    if (photo) {
      dataToUpdate.photo = photo;
    }
    if (certificate) {
      dataToUpdate.certificate = certificate;
    }

    // Only update education and experience if they are not empty
    if (education && education.length > 0) {
      dataToUpdate.education = education;
    }
    if (experience && experience.length > 0) {
      dataToUpdate.experience = experience;
    }

    try {
      const res = await fetch(`${BASE_URL}/doctors/updateDoctor/${data._id}`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${docToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToUpdate),
      });

      const result = await res.json();
      console.log(result, "from doctor profile settings");
      if (!res.ok) {
        throw new Error(result.message);
      }

      dispatch(setDoctorCredentials(result.data));

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
        <form onSubmit={submitHandler} encType="multipart/form-data">
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="username"
              >
                Name
              </label>
              <input
                id="name"
                type="name"
                name="name"
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
                name="email"
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                readOnly
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
            <div className="mt-auto mb-0">
              <label className="text-white dark:text-gray-200">gender</label>
              <select
                name="gender"
                id="gender"
                onChange={(e) => setGender(e.target.value)}
                value={gender}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-black-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
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
                <option value="Cardiology">Cardiologist</option>
                <option value="Neurology">Neurologist</option>
                <option value="Pediatrics">pediatrician</option>
                <option value="Deramtology">Deramtologist</option>
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
            <div className="flex items-center justify-center gap-1">
              {/* /////////////////////photo upload///////////////////// */}
              <div className="flex flex-col items-center gap-3 mb-5 mt-7">
                {photo && (
                  <figure className=" w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center ">
                    <img
                      src={previewURL}
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
              </div>

              {/* /////////////////////ceritificate upload///////////////////// */}
              <div className="flex flex-col items-center gap-3 mb-5 mt-7">
                {certificate &&
                  certificate.map((certificatepreviewURL, index) => (
                    <figure
                      key={index}
                      className="w-[60px] h-[60px]  border-2 border-solid border-primaryColor flex items-center justify-center"
                    >
                      <img
                        src={certificatepreviewURL}
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
              </div>
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="passwordConfirmation"
              >
                About
              </label>
              <textarea
                type="text"
                onChange={(e) => setAbout(e.target.value)}
                value={about}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                defaultValue={""}
                placeholder="write something about you"
              />
            </div>

            {education.map((edu, index) => (
              <div key={index} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`education-${index}-start`}
                    className="text-white dark:text-gray-200"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id={`education-${index}-start`}
                    value={edu.start}
                    onChange={(e) =>
                      updateEducation(index, "start", e.target.value)
                    }
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`education-${index}-end`}
                    className="text-white dark:text-gray-200"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id={`education-${index}-end`}
                    value={edu.end}
                    onChange={(e) =>
                      updateEducation(index, "end", e.target.value)
                    }
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`education-${index}-course`}
                    className="text-white dark:text-gray-200"
                  >
                    Course
                  </label>
                  <input
                    type="text"
                    id={`education-${index}-course`}
                    value={edu.course}
                    onChange={(e) =>
                      updateEducation(index, "course", e.target.value)
                    }
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`education-${index}-college`}
                    className="text-white dark:text-gray-200"
                  >
                    College
                  </label>
                  <input
                    type="text"
                    id={`education-${index}-college`}
                    value={edu.college}
                    onChange={(e) =>
                      updateEducation(index, "college", e.target.value)
                    }
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-white dark:text-gray-200 bg-red-500 px-3 py-1 rounded-md"
                >
                  Remove Education
                </button>
              </div>
            ))}

            {experience.map((exp, index) => (
              <div key={index} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`experience-${index}-start`}
                    className="text-white dark:text-gray-200"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id={`experience-${index}-start`}
                    value={exp.start}
                    onChange={(e) =>
                      updateExperience(index, "start", e.target.value)
                    }
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`experience-${index}-end`}
                    className="text-white dark:text-gray-200"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id={`experience-${index}-end`}
                    value={exp.end}
                    onChange={(e) =>
                      updateExperience(index, "end", e.target.value)
                    }
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`experience-${index}-position`}
                    className="text-white dark:text-gray-200"
                  >
                    Position
                  </label>
                  <input
                    type="text"
                    id={`experience-${index}-position`}
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(index, "position", e.target.value)
                    }
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`experience-${index}-department`}
                    className="text-white dark:text-gray-200"
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    id={`experience-${index}-department`}
                    value={exp.department}
                    onChange={(e) =>
                      updateExperience(index, "department", e.target.value)
                    }
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-white dark:text-gray-200 bg-red-500 px-3 py-1 rounded-md"
                >
                  Remove Experience
                </button>
              </div>
            ))}

            <div className="flex justify-end mt-6 space-x-4 ">
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a1 1 0 0 1-1 1H5a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1zM5 8a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2H5z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Education
              </button>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a1 1 0 0 1-1 1H5a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1zM5 8a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2H5z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Experience
              </button>
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
