import React, { useEffect, useRef } from "react";
import { BiMenu } from "react-icons/bi";
import logo from "../../assets/images/logo5.png";
import { NavLink, useNavigate } from "react-router-dom";

const navlinks = [
  {
    path: "/admin/Home",
    display: "Home",
  },
  {
    path: "/admin/users",
    display: "Users",
  },
  {
    path: "admin/doctors",
    display: "Doctors",
  },
  {
    path: "/admin/bookings",
    display: "Bookings",
  },
];

const AdminHeader = () => {
  const navigate = useNavigate();
  const adminInfo = localStorage.getItem("adminInfo");

  const headerRef = useRef(null);
  <img src={logo} alt="medicareLogo" />;
  const menuRef = useRef(null);

  const handlestickyHeader = () => {
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
    handlestickyHeader();

    return () => {
      window.removeEventListener("scroll", handlestickyHeader);
    };
  });

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const toggleMenu = () => menuRef.current.classList.toggle("show_menu");
  return (
    <header className="header flex items-center " ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo} alt="medicareLogo" />
          </div>
          {adminInfo && (
            <>
              <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                <ul className="menu flex items-center gap-[2.7rem]">
                  {navlinks.map((link, index) => (
                    <li key={index}>
                      <NavLink
                        to={link.path}
                        className={(navClass) =>
                          navClass.isActive
                            ? "text-primaryColor text-[16px] loading-7 font-[600]"
                            : "text-textColor text-[16px] loading-7 font-[500] hover:text-primaryColor"
                        }
                      >
                        {link.display}
                      </NavLink>
                    </li>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="bg-primaryColor py-2 px-6 text-white font-[600] h-[37px] flex items-center cursor-pointer justify-center rounded-[50px]"
                  >
                    Logout
                  </button>
                </ul>
              </div>
              <span className="md:hidden" onClick={toggleMenu}>
                <BiMenu className="w-6 h-6 cursor-pointer" />
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
