import React, { Suspense } from "react";

const LazyDoctorsCard = React.lazy(() => import("./DoctorsCard"));

const DoctorsList = (data) => {
  console.log(data);
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <LazyDoctorsCard data={data} />
      </Suspense>
    </>
  );
};

export default DoctorsList;
