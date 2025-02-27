import { doctors } from "../../assets/data/doctor";
import DoctorCard from "./DoctorCard";

const DoctorList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[50px]  md:p-8  lg:mt-[55px]">
      {doctors.map((doctor , index) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
     
      ))}
    </div>
  );
};

export default DoctorList;
