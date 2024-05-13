import { useEffect, useRef, useContext, useState } from "react";
import logo2 from "../../assets/images/logo5.png";
import userImg from "../../assets/images/avatar-icon.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { doctorPath, userPath } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { logoutPatient } from "../../slices/patientAuthSlice";
import { IoIosNotifications } from "react-icons/io";
import Notification from "../notification/Notification";

const navLinks = [
  {
    path: "/users/home",
    display: "Home",
  },
  {
    path: "/users/doctors",
    display: "Find a Doctor",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const [notification, setNotification] = useState(false);
  // const { user, role, token } = useContext(authContext);

  // const user = JSON.parse(localStorage.getItem("PatientInfo"));
  const user = useSelector((state) => state.patientAuthReducer.PatientInfo);

  // const { role, token } = user;

  const role = user?.role;
  const token = user?.token;
  const path = role === "patient" ? userPath : doctorPath;

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky_header");
      } else {
        headerRef.current.classList.add("sticky_header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();

    return () => window.removeEventListener("scroll", handleStickyHeader);
  });

  const toggleMenu = () => menuRef.current.classList.toggle("show_menu");

  const handleLogout = () => {
    dispatch(logoutPatient());
  };

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("PatientInfo"));
  //   setUser(storedUser || {});
  // }, [token]); // Update the user state when the token changes

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/*===========Logo============== */}

          <div>
            <Link to="/">
              <img src={logo2} alt="" />
            </Link>
          

          </div>

          {/* ==============Menu=========== */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center  gap-[2.7rem] ">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16-px] leading-7 font-[600]"
                        : "text-textColor text-[16-px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/*============Nav right */}

          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="flex">
                <div
                  onClick={() => setNotification(true)}
                  className="flex items-center mr-6 cursor-pointer"
                >
                  <IoIosNotifications className="text-[20px]" />
                </div>
                <Link to="/userProfile">
                  <div className="flex items-center gap-4">
                    <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                      <img
                        src={`${user.photo}`}
                        className="w-full rounded-full"
                        alt=""
                      />
                    </figure>

                    <h2 className="flex font-semibold"> {user?.name}</h2>
                  </div>
                </Link>
                <Link to="/users/login" className="flex items-center ml-5">
                  <button
                    onClick={handleLogout}
                    className="bg-primaryColor py-2 px-6 text-white font-[600] h-[37px] flex items-center cursor-pointer justify-center rounded-[50px]"
                  >
                    logout
                  </button>
                </Link>
                {/***Notification start */}

                {notification&&(
                  <Notification setNotification={setNotification} />
                )}

                {/**end */}
              </div>
            ) : (
              <Link to="/users/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center  rounded-[50px]">
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6  h-6  cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
