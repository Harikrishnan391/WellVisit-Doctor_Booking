import React from "react";

import Header from "../components/Header/Header";
import AdminHeader from "../components/Header/AdminHeader";
import DoctorHeader from "../components/Header/DoctorHeader";
import Footer from "../components/Footer/Footer";
import Routers from "../routes/Routers";
import {useLocation} from "react-router-dom"

const Layout = () => {

  let location=useLocation()
  let doctorHeader=location.pathname.startsWith('/doctors')
  let adminHeader=location.pathname.startsWith('/admin')


  return (
    <>
    {
      ((adminHeader)?<AdminHeader/>:doctorHeader?<DoctorHeader/>:<Header />)
    }
  
      <main>
        <Routers />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
