import { useEffect, useState, useRef } from "react";
import Testimonial from "../../components/Testimonial/Testimonial";
import DoctorsList from "./DoctorsList";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../config";
import getDoctors from "../../hooks/userFetchData";
import Error from "../../components/About/Error";
import { RiFilterLine } from "react-icons/ri";
import apiInstance from "../../slices/ApiSlices.js";
import Pagination from "../../components/pagination/Pagination.jsx";

import { AnimatePresence, motion } from "framer-motion";

const Doctors = () => {
  const dispatch = useDispatch();
  const [docData, setDocData] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(8);
  const [showfilterModal, setShowFilterModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [specializations, setSpecialization] = useState(null);

  const { data, loading, error } = getDoctors(
    `${BASE_URL}/doctors/getAllDoctor`
  );

  //move the filtered logic to a seperated function
  const filterDoctors = (data) => {
    return data.filter(
      (doctor) =>
        doctor.isApproved === true &&
        (doctor.name.toLowerCase().includes(search.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(search.toLowerCase()))
    );
  };

  useEffect(() => {
    if (error) {
      console.log("Error in fetching data");
    } else {
      setTimeout(() => {
        setDocData(data);
        const filteredDoctors = filterDoctors(data);
        setIsLoading(false);
      }, 1000);
    }
  }, [dispatch, data, loading, error, search]);

  /////  For adding specialization in to the side Bar
  useEffect(() => {
    // if (docData.length > 0) {
    //   const specialties = [
    //     ...new Set(docData.map((doctor) => doctor.specialization)),
    //   ];
    //   setSpecialization(specialties);
    // }
    const customeSpecializations = [
      "Cardiology",
      "Dermatology",
      "Neurology",
      "Pediatrics",
      "Orthopedics",
      "Ophthalmology",
    ];
    setSpecialization(customeSpecializations);
  }, [docData]);

  useEffect(() => {
    const filteredDoctors = filterDoctors(docData);
    setFilteredResult(filteredDoctors);
  }, [docData, search]);

  const handlefilter = async (filterorder, e) => {
    e.preventDefault();
    console.log(filterorder, "filterorder");

    try {
      const res = await apiInstance.get(`${BASE_URL}/users/getDoctors/filter`, {
        params: { query: filterorder },
      });

      // console.log(res, "response");
      if (res.data && res.data.doctors) {
        setDocData(res.data.doctors);
      }

      setIsSidebarOpen(false);
    } catch (error) {}
  };

  ////handle specialization filte

  const handleSpecializationFilter = async (specialization) => {
    try {
      const res = await apiInstance.get(
        `${BASE_URL}/users/filterBySpecialization`,
        {
          params: { specialization },
        }
      );
      console.log(res, "response");
      if (res.data && res.data.doctors) {
        console.log(res.data.doctors, "special doctors");
        setDocData(res.data.doctors);
      }
    } catch (error) {
      console.error("Error filtering doctors by specialization", error);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    const filteredDoctors = filterDoctors(docData);
    setFilteredResult(filteredDoctors);
  };

  const filterSectionRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        filterSectionRef.current &&
        !filterSectionRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  ////sort content

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = filteredResult.slice(firstPostIndex, lastPostIndex);

  return (
    <>
      <section className="bg-[#fff9ea] mt-0">
        <div className="container text-center">
          <h2 className="heading"> Find a Doctor</h2>
          <div className="max-w-[570px]  mx-auto bg-[#8eb1e42e] rounded-md items-center  flex justify-between">
            <input
              type="search"
              onChange={handleSearch}
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor ml-[80px]"
              placeholder="Search Doctor"
            />
            <button className="btn  mt-0  ml-4 rounded-[0px] rounded-r-md ">
              search
            </button>

            <div className="ml-1"></div>

            {/* Sort Bar */}
          </div>
        </div>
      </section>

      {/** filter seciton */}
      {/* <div className="flex justify-end mr-8"> */}
      <section className="mr-12" ref={filterSectionRef}>
        <div className="ml-1 flex justify-end mr-8">
          <RiFilterLine
            id="filterIcon"
            className="cursor-pointer"
            size={24}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          Filter
        </div>

        <div className="bg-white">
          <div>
            <div
              className={`relative z-40 ${isSidebarOpen ? "" : "hidden"}`}
              role="dialog"
              aria-modal="true"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
              <div className="fixed inset-0 z-40 flex">
                {isSidebarOpen && (
                  <div
                    className={`relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 ${
                      isSidebarOpen ? "" : "hidden"
                    }`}
                  >
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        Filters
                      </h2>
                      <button
                        type="button"
                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <form className="mt-4 border-t border-gray-200">
                      <h3 className="sr-only">Categories</h3>

                      <div className="border-t border-gray-200 px-4 py-6">
                        <h3 className="-mx-2 -my-3 flow-root">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                            aria-controls="filter-section-mobile-0"
                            aria-expanded="false"
                          >
                            <span className="font-medium text-gray-900">
                              Price
                            </span>
                            <span className="ml-6 flex items-center"></span>
                          </button>
                        </h3>
                        <div className="pt-6" id="filter-section-mobile-0">
                          <div className="space-y-6">
                            <div className="flex items-center">
                              <button
                                onClick={(e) => handlefilter("1-500", e)} // Pass the event to handlefilter
                                className="mr-44 min-w-0 flex-1 text-gray-500"
                              >
                                ₹1 - ₹500
                              </button>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={(e) => handlefilter("501-1000", e)}
                                className="mr-40 min-w-0 flex-1 text-gray-500"
                              >
                                ₹501-₹1,000
                              </button>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={(e) => handlefilter("1001-2000", e)}
                                className="mr-36 min-w-0 flex-1 text-gray-500"
                              >
                                ₹1001-₹2,000
                              </button>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={(e) => handlefilter("2001-above", e)}
                                className="mr-32 min-w-0 flex-1 text-gray-500"
                              >
                                ₹2001 and above
                              </button>
                            </div>
                          </div>
                        </div>
                        {/**filter section by specialization start */}
                        <div className="border-t border-gray-200 px-4 py-6">
                          <h3 className="-mx-2 -my-3 flow-root">
                            <button
                              type="button"
                              className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                              aria-controls="filter-section-mobile-1"
                              aria-expanded="false"
                            >
                              <span className="font-medium text-gray-900">
                                Specialization
                              </span>
                              <span className="ml-6 flex items-center">
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" />
                                </svg>
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
                                  />
                                </svg>
                              </span>
                            </button>
                          </h3>
                          <div className="pt-6" id="filter-section-mobile-1">
                            <div className="space-y-6">
                              {/** Map over the list of specializations and render a button for each */}
                              {specializations.map((specialization) => (
                                <div
                                  className="flex items-center"
                                  key={specialization}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleSpecializationFilter(
                                        specialization
                                      );
                                    }}
                                    className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    {specialization}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/**filter section by specialization end */}
                        <div className="border-t border-gray-200 px-4 py-6">
                          <h3 className="-mx-2 -my-3 flow-root">
                            <button
                              type="button"
                              onClick={() => setDocData(data)}
                              className="flex w-full items-center justify-between bg-white px-4 py-3 text-gray-900 font-medium border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            >
                              All Doctors
                            </button>
                          </h3>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/** sort */}
      </section>
      <section>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5  lg:grid-cols-4">
            <DoctorsList data={currentPosts} />
          </div>
        </div>
      </section>
      <Pagination
        postPerPage={postPerPage}
        totalPosts={filteredResult.length}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      {/* <section className="mt-11">
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What our patient Says</h2>
            <p className="text_para text-center">
              World class care for everyOne.Our health System offers unmatched.
              expert health care.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>  */}
    </>
  );
};

export default Doctors;
