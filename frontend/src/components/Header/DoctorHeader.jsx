import { useDebugValue, useEffect, useRef, useState } from "react";

import logo2 from "../../assets/images/logo5.png";
import { NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BiMenu } from "react-icons/bi";
import { logoutDoctor } from "../../slices/doctorAuthSlice.js";

import { userPath, doctorPath } from "../../config.js";

const navlinks = [
  {
    path: "/doctors/home",
    display: "Home",
  },
  {
    path: "/doctors/appointments",
    display: "Appointments",
  },
];

const DoctorHeader = () => {
  const dispatch = useDispatch();
  let path;
  const headerRef = useRef(null);
  const menuref = useRef(null);

  const user = JSON.parse(localStorage.getItem("doctorInfo"));

  const role = user?.role;
  console.log(role);
  const token = user?.token;
  path = role === "patient" ? userPath : doctorPath;

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky_header");
      } else {
        headerRef.current.classList.remove("sticky_header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();

    return () => {
      window.removeEventListener("scroll", handleStickyHeader);
    };
  });

  const toggleMenu = () => menuref.current.classList.toggle("show_menu");

  const handleLogout=()=>{

    dispatch(logoutDoctor())
  }

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo2} alt="" />
          </div>

          {/**=====menu======= */}
          <div className="navigation" ref={menuref} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navlinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600]"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-irisBlueColor"
                    }
                  >
                    <span>{link.display}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 mt-2 mb-2 ml-5">
            {token && user ? (
              <div className="flex">
                <Link to={"/doctors/doctorProfile"}>
                  <div className="flex items-center gap-4">
                    <figure className="w-[40px] h-[35px] flex align-middle">
                      <img
                        src={`${path}${user.photo}`}
                        alt=""
                        className="rounded-full"
                      />
                    </figure>
                    <h2 className="flex font-semibold my-4">{user?.name}</h2>
                  </div>
                </Link>

                <Link to="/doctors/login" className="flex items-center ml-5">
                  <button onClick={handleLogout} className="bg-primaryColor py-2 px-6 text-white font-[600] h-[37px] flex items-center cursor-pointer justify-center rounded-[50px]">
                    Logout
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/doctors/login">
                  <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[37px] flex items-center cursor-pointer justify-center rounded-[50px]">
                    Login
                  </button>
                </Link>
                <Link to="/doctorSignup">
                  <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[37px] flex items-center cursor-pointer justify-center rounded-[50px]">
                    Signup
                  </button>
                </Link>
              </div>
            )}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DoctorHeader;
