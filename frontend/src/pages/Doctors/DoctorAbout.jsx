import React from "react";
import { FormateDate } from "../../utils/FormateDate";

const DoctorAbout = ({ details }) => {
  return (
    <div>
      <h3 className="text-[20px]  leading-[30px] text-headingColor font-bold  flex items-center   gap-2">
        About of
        <span className="tex[20px] text-irisBlueColor  font-bold text-[24px] leading-9   ">
          {details.name}
        </span>
      </h3>
      <p className="text_para">
      {details.about}
      </p>
      <div className="mt-12 ">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
          Education
        </h3>
        <ul className="pt-4 md:p-5">
          <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
            <div>
              <span className="text-irisBlueColor text-[15px]  leading-6 font-semibold">
                {FormateDate("09-04-2014")}- {FormateDate("12-04-2016")}
              </span>
              <p className="text-[16px] leading-6 font-medium text-textColor ">
                PHD surgeon
              </p>
            </div>
            <p className="text-[14px] leading-5 font-medium text-textColor ">
              New Appolo Hospital ,New York
            </p>
          </li>
        </ul>

        <ul className="pt-4 md:p-5">
          <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
            <div>
              <span className="text-irisBlueColor text-[15px]  leading-6 font-semibold">
                {FormateDate("12-04-2010")}- {FormateDate("12-04-2012 ")}
              </span>
              <p className="text-[16px] leading-6 font-medium text-textColor ">
                surgeon
              </p>
            </div>
            <p className="text-[14px] leading-5 font-medium text-textColor ">
              New Appolo Hospital ,New York
            </p>
          </li>
        </ul>
      </div>

      <div className="mt-12">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
          Experience
        </h3>

        <ul className="grid sm:grid-cols-2  gap-[30px] p-4 md:p-5">
          <li className="p-4 rounded bg-[#fff9ea]">
            <span className="text-yellowColor text-[15px] leading-6 font-semibold">
              {FormateDate("09-04-2014")}- {FormateDate("12-04-2016")}
            </span>
            <p className="text-[16px] leading-6 font-medium text-textColor">
              Sr.Surgeon
            </p>
            <p className="text-[14px] leading-5 font-medium text-textColor ">
              New Appolo Hospital ,New York
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DoctorAbout;
