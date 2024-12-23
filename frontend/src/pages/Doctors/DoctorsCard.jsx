import React from "react";
import { Link } from "react-router-dom";
import { doctorPath } from "../../config";
import starIcon from "../../assets/images/Star.png";
import { LiaCertificateSolid } from "react-icons/lia";

const DoctorsCard = (data) => {
  return (
    <>
      {data.data.data.map((el) => (
        <Link to={`/users/doctorDetails/${el._id}`} key={el._id}>
          {el.certificateApprove && (
            <article
              className="relative mx-auto max-w-sm shadow-xl bg-cover bg-center h-96 transform duration-500 hover:-translate-y-2 cursor-pointer group rounded-xl overflow-hidden"
              style={{ backgroundImage: `url(${el.photo})` }}
            >
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-[10] text-xs">
                <h1 className="text-lg font-semibold mb-1 ml-3">
                  Dr. {el.name}
                </h1>
                <div className="flex justify-between mb-2 ml-3">
                  <span className="bg-[#24a7b3] py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[12px] lg:leading-7 font-semibold rounded">
                    {el.specialization}
                  </span>
                  <div className="flex items-center ml-3 justify-end mr-11">
                    <span className="flex items-center gap-[3px] text-[12px] leading-6 lg:text-[15px] lg:leading-7 font-semibold text-headingColor">
                      <LiaCertificateSolid className="w-12 h-8 bg-yellowColor" />
                      {el.degree}
                    </span>
                  </div>
                </div>
                <div className="text-right mr-10">
                  <h3 className="text-[10px] mt-2 leading-7 lg:text-[13px] lg:leading-[30px] font-semibold text-headingColor">
                    +1300 patients
                  </h3>
                  <p className="text-[14px] leading-6 font-[400] text-textColor">
                    {el.college}
                  </p>
                </div>
                <div className="mt-2 py-2">
                  <p className="font-semibold">Fee:{el.fee}.Rs</p>
                </div>
              </div>
            </article>
          )}
        </Link>
      ))}
    </>
  );
};

export default DoctorsCard;
