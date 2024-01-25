import { useEffect, useState } from "react";
import Testimonial from "../../components/Testimonial/Testimonial";
import DoctorsList from "./DoctorsList";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../config";
import getDoctors from "../../hooks/userFetchData";
import Error from "../../components/About/Error";
import { RiFilterLine } from "react-icons/ri";
import apiInstance from "../../slices/ApiSlices.js";
import Pagination from "../../components/pagination/Pagination.jsx";

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

  const [sortOption, setSortOption] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // ... existing code

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const { data, loading, error } = getDoctors(
    `${BASE_URL}/doctors/getAllDoctor`
  );

  console.log(docData, "doc Data");

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



  useEffect(() => {
    const filteredDoctors = filterDoctors(docData);
    setFilteredResult(filteredDoctors);
  }, [docData, search]);


  const handlefilter = async (filterorder, e) => {
    e.preventDefault();
    console.log(filterorder, "filterorder");

    try {
      const res = await apiInstance.get(`${BASE_URL}/users/getDoctors/filter`,{
        params:{query:filterorder}
      });

      console.log(res,"response")
      if(res.data&& res.data.doctors){
        console.log(res.data.doctors,"courses")

        setDocData(res.data.doctors)

      }

      setIsSidebarOpen(false)
      
      

    } catch (error) {}
  };



  const handleSearch = (event) => {
    setSearch(event.target.value);
    const filteredDoctors = filterDoctors(docData);
    setFilteredResult(filteredDoctors);
  };

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
      <section className="mr-12">
        <div className="ml-1 flex justify-end mr-8">
          <RiFilterLine
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
                      </div>
                      <div className="border-t border-gray-200 px-4 py-6">
                        <h3 className="-mx-2 -my-3 flow-root">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                            aria-controls="filter-section-mobile-1"
                            aria-expanded="false"
                          >
                            <span className="font-medium text-gray-900">
                              Category
                            </span>
                            <span className="ml-6 flex items-center">
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                              </svg>
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </button>
                        </h3>
                        <div className="pt-6" id="filter-section-mobile-1">
                          <div className="space-y-6">
                            <div className="flex items-center">
                              <input
                                id="filter-mobile-category-3"
                                name="category[]"
                                defaultValue="organization"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor="filter-mobile-category-3"
                                className="ml-3 min-w-0 flex-1 text-gray-500"
                              >
                                Organization
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="filter-mobile-category-4"
                                name="category[]"
                                defaultValue="accessories"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor="filter-mobile-category-4"
                                className="ml-3 min-w-0 flex-1 text-gray-500"
                              >
                                Accessories
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-6">
                        <div
                          className="pt-6"
                          id="filter-section-mobile-2"
                        ></div>
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
            <DoctorsLidrst data={currentPosts} />
          </div>
        </div>
      </section>

     <Pagination postPerPage={postPerPage} totalPosts={filteredResult.length} setCurrentPage={setCurrentPage}  currentPage={currentPage}  />

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
      </section> */}
    </>
  );
};

export default Doctors;

