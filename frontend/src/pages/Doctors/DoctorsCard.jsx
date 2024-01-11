import React from "react";
import { Link } from "react-router-dom";
import { doctorPath } from "../../config";
import starIcon from "../../assets/images/Star.png";

const DoctorsCard = (data) => {
  console.log(data, "doctorsCard");
  return (
    <>
    
      {data.data.data.map((el) => (
        <Link to={`/users/doctorDetails/${el._id}`}>
        <article

          key={el._id}
          className="mx-auto max-w-sm shadow-xl bg-cover bg-center h-96 transform duration-500 hover:-translate-y-2 cursor-pointer group rounded-xl overflow-hidden relative"
          style={{
            backgroundImage: `url(${doctorPath}${el.photo})`,
          }}
        >
          <div className="bg-black bg-opacity-20 h-full px-10 flex  mb-4 flex-wrap flex-col pt-36 hover:bg-opacity-75 transform duration-300 rounded-b-xl">
            <h1 className="text-white mt-8 text-3xl mb-2 transform translate-y-10 group-hover:translate-y-0 duration-300">
              Dr.{el.name}
            </h1>
            
            <div className="w-16 h-2 bg-orange-500 rounded-full mb-3 transform translate-y-10 group-hover:translate-y-0 duration-300"></div>
            <p className="opacity-0 text-white text-xl group-hover:opacity-80 transform duration-500">
              {/* Additional details */}
              <div className=" details-container  bottom-2 left-0 right-0 bg-white bg-opacity-100 p-4 text-white text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-[#24a7b3] py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[12px] lg:leading-7 font-semibold rounded">
                    {el.specialization}
                  </span>
                  <div className="flex items-center ml-3  justify-end">
                    <span className="flex items-center gap-[1px] text-[12px] leading-6 lg:text-[15px] lg:leading-7 font-semibold text-headingColor">
                      <img src={starIcon} className="w-5" alt="" />
                      4.3
                    </span>
                    <span className="text-[10px] ml-2 leading-6 lg:text-[12px] lg:leading-7 font-[400] text-headingColor">
                      (282)
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] mt-2 leading-7 lg:text-[13px] lg:leading-[30px] font-semibold text-headingColor">
                    +1300 patients
                  </h3>
                  <p className="text-[14px] leading-6 font-[400] text-textColor">
                    Manipal Hospital
                  </p>
                </div>
              </div>
            </p>
          </div>
        </article>
        </Link>
      ))}
    </>
  );
};

export default DoctorsCard;


  {/* {data.data.data.map((el)=>(
<article
 key={el._id}
  className="mx-auto max-w-sm shadow-xl bg-cover bg-center min-h-90 transform duration-500 hover:-translate-y-2 cursor-pointer group rounded-xl overflow-hidden"
  style={{
    backgroundImage:`url(${doctorPath}${el.photo})`
  }}
>
  <div className="bg-black bg-opacity-20  px-10 flex flex-wrap flex-col pt-36 hover:bg-opacity-75 transform duration-300 rounded-b-xl">
  
    <h1 className="text-white text-3xl mb-5 transform translate-y-10 group-hover:translate-y-0 duration-300">
      
      Dr.{el.name}
    </h1>
    <div className="w-16 h-2 bg-orange-500 rounded-full mb-5 transform translate-y-10 group-hover:translate-y-0 duration-300"></div>
    <p className="opacity-0 text-white text-xl group-hover:opacity-80 transform duration-500">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, beatae!
    </p>
  </div>
</article>
))} */}

// <>
//   {data.data.data.map((el) => (
//     <div
//       key={el._id}
//       className="mx-auto max-w-sm shadow-xl bg-cover bg-center min-h-50 transform duration-500 hover:-translate-y-2 cursor-pointer group rounded-xl overflow-hidden"
//       style={{
//         backgroundImage: `url(${doctorPath}${el.photo})`,
//       }}
//     >
//       <Link to={`/users/doctorDetails/${el._id}`}>
//         <div>
//           <img
//             src={`${doctorPath}${el.photo}`}
//             alt=""
//             className="w-full rounded-md"
//           />
//         </div>
//         <h1 className="text-white text-3xl mb-5 transform translate-y-10 group-hover:translate-y-0 duration-300">
//           Dr. {el.name}
//         </h1>
//       </Link>
//       <div className="bg-black bg-opacity-20 min-h-90 px-10 flex flex-wrap flex-col pt-36 hover:bg-opacity-75 transform duration-300 rounded-b-xl">
//         <div className="w-16 h-2 bg-orange-500 rounded-full mb-5 transform translate-y-10 group-hover:translate-y-0 duration-300"></div>
//         <p className="opacity-0 text-white text-xl group-hover:opacity-80 transform duration-500">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime,
//           beatae!
//         </p>
//       </div>
//     </div>
//   ))}
// </>
