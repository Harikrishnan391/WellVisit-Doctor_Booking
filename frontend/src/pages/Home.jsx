import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
import heroImg01 from "../assets/images/Doctor1.png";
import heroImg02 from "../assets/images/hero-img02.png";
import heroImg03 from "../assets/images/hero-img03.png";
import icon01 from "../assets/images/icon01.png";
import icon02 from "../assets/images/icon02.png";
import icon03 from "../assets/images/icon03.png";
import featureImg from "../assets/images/feature-img.png";
import videoIcon from "../assets/images/video-icon.png";
import avatarIcon from "../assets/images/avatar-icon.png";
import faqImg from "../assets/images/faq-img.png";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import About from "../components/About/About";
import  ShuffleHero from "../components/Slider/ShuffleHero";
import ServiceList from "../components/Services/ServiceList";
import FaqList from "../components/Faq/FaqList";
import Testimonial from "../components/Testimonial/Testimonial";
import DoctorList from "../components/Doctors/DoctorList";
import { Carousel } from "@material-tailwind/react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
    "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
    "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1480985041486-c65b20c01d1f?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  /*=============for Banner images==================== */
  useEffect(() => {
    const interValid = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interValid);
  }, [images.length]);

  /**==============for Animated scroll effect==================== */

  const HandleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", HandleScroll);

    return () => {
      window.removeEventListener("scroll", HandleScroll);
    };
  }, []);

  const parallaxProps = useSpring({
    transform: `translateY(${scrollY / 2}px)`,
    opacity: 1 - scrollY / 1000,
  });

  const ref = { useRef };

  return (
    <>
      {/**Section for moving currosals   */}
    
        <div className="rounded-xl overflow-hidden relative h-96">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`image ${index + 1}`}
              className={`absolute top-0 left-0 h-full w-full object-cover ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              } transition-opacity duration-1000`}
            />
          ))}
        </div>
   
      {/**=======hero section==== */}
      <ShuffleHero />

      <section className="hero_section pt-[60px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row  gap-[90px] items-center justify-between">
            {/**======hero content========= */}

            <div>
              <div className="lg:w-[570px]">
                <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
                  <span>We're here when you need us .</span>
                </h1>
                <p className="text_para">
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text. It has roots in a piece of classical Latin literature
                  from 45 BC, making it over 2000 years old. Richard McClintock,
                  a Latin professor at Hampden-Sydney College in Virginia,
                  looked up one of the more obscure Latin words, consectetur,
                </p>
                <button className="btn">Request An appointment</button>
              </div>
              {/*===hero Counter===== */}
              <div className="mt-[30px] lg:mt-[70px] flex  flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    30+
                  </h2>
                  <span className="w-[100px] h-2 bg-yellowColor rounded-full block mt-[-140x] "></span>
                  <p className="text_para">Years of Experience</p>
                </div>
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    15+
                  </h2>
                  <span className="w-[100px] h-2 bg-purpleColor rounded-full block mt-[-140x] "></span>
                  <p className="text_para">Clinic locations</p>
                </div>
                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    100%
                  </h2>
                  <span className="w-[100px] h-2 bg-irisBlueColor rounded-full block mt-[-140x] "></span>
                  <p className="text_para">Patient Satisfication</p>
                </div>
              </div>
            </div>

            {/**======hero content========= */}

            <div className="flex  justify-end ">
              <div>
                <img
                  className="width-full h-47 object-cover"
                  src={heroImg01}
                  alt=""
                />
              </div>
              <div>
                <img
                  className="width-full h-47 object-cover"
                  src={heroImg01}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
         {/** framer animation */}

         
      {/**=======hero section end==== */}

      <section>
        <div className="container">
          <div className="lg:w-[470px] mx-auto ">
            <h2 className="heading text-center">
              Providing the Best Medical service
            </h2>
            <p className="text_para text-center">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form{" "}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon01} alt="" />
              </div>
              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Our Doctors
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form
                </p>
                <Link
                  to="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex  items-center justify-center group  hover:bg-primaryColor hover:border-none"
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-5 " />
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon02} alt="" />
              </div>
              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-heaadingColor font-[700] text-center">
                  Locations and Directions
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form
                </p>
                <Link
                  to="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex  items-center justify-center group  hover:bg-primaryColor hover:border-none"
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon03} alt="" />
              </div>
              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-heaadingColor font-[700] text-center">
                  Appointments
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form
                </p>
                <Link
                  to="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex  items-center justify-center group  hover:bg-primaryColor hover:border-none"
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*================About section start===========*/}
     
        <About/>
    
      {/* ============services section======= */}
      {/* <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center"> Our Medical Services</h2>
            <p className="text_para text-center">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form
            </p>
          </div>
          <ServiceList />
        </div>
      </section> */}
      {/* ============services end============ */}

      {/** Docots section */}
   
        <DoctorList />
  

      {/*====Feature section start================== */}

      <section>
        <div className="container">
          <div className="flex items-center justify-between flex-col lg:flex-row ">
            {/*======Feature Content========= */}
            <div className="xl:w-[670px]">
              <h2 className="heading">
                Get virtual Treatement <br />
                Any time
              </h2>
              <ul className="pl-4">
                <li className="text_para">
                  1.Schedule the appointment directly
                </li>
                <li className="text_para">
                  2.Search for your physician here ,and contact their office
                </li>
                <li className="text_para">
                  3.View our physicians who are accepting new patients ,use the
                  online scheduling tool to select an appointment time.
                </li>
              </ul>
              <Link to="/">
                <button className="btn">Learn More</button>
              </Link>
            </div>
            {/** ==========feature image=============== */}
            <div className="relative z-10 xl:w-[770px] flex justify-end  mt-[50px] lg:mt-0">
              <img src={featureImg} className="w-3/4" alt="" />
              <div className="w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0 md:bottom-[100px] md:left-5 z-20 p-2 pb-3  lg:pt-4 lg:px-4  lg:pb-[26px] rounded-[10px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[6px] lg:gap-3 ">
                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[400] ">
                      Tue,24
                    </p>
                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor font-[400] ">
                      10.00 AM
                    </p>
                  </div>
                  <span className="w-5 h-5 lg:w-[35px] lg:h-[34px] flex items-center  justify-center  bg-yellowColor rounded py-1 px-[6px]  lg:px-[9px] ">
                    <img src={videoIcon} />
                  </span>
                </div>

                <div className="w-[65px] lg:w-[96px] bg-[#CCF0F3 ]  py-1 px-2 lg:py-[6px] lg:px-[10px] text-[8px] leading-[8px] lg:text-[12px] lg:leading-4 text-irisBlueColor  font-[500] mt-2 lg:mt-4 rounded-full">
                  consultation
                </div>

                <div className="flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px]">
                  <img src={avatarIcon} />
                  <h4 className="text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700] text-headingColor">
                    {" "}
                    wayne collins
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*=====Feature section end =========== */}
      {/*===========Faq section start=========== */}

      <section>
        <div className="container">
          <div className="flex justify-between gap-[50px] lg:gap-0">
            <div className="w-1/2 hidden md:block ">
              <img src={faqImg} />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="heading">
                Most questions by our beloved patients
              </h2>
              <FaqList />
            </div>
          </div>
        </div>
      </section>

      {/*===============Faq Section end================ */}

      {/*===============Testimonila start================ */}

      <section>
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
      </section>
      {/*===============Testimonial end================ */}
    </>
  );
};

export default Home;
