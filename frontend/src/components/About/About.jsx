import React from "react";
import aboutImg from "../../assets/images/about.png";
import aboutCardImg from "../../assets/images/about-card.png";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="p-4 md:p-8 lg:p-12 lg:mt-12">
      <div className="conatiner">
        <div className="flex  items-center justify-between gap-[20px] lg:gap-[1px]  flex-col lg:flex-row">
          {/**=====about image */}
          <div className="relative w-3/4 lg:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1 lg:left-[50px] ">
            <img src={aboutImg} alt="" />
            <div className="absolute z-20 bottom-3 w-[200px] md:w-[300px] right-[-30%] md:right-[-7%] lg:right-[22%] left-[40%]">
              <img src={aboutCardImg} alt="" />
            </div>
          </div>
          {/**=======about content=======*/}
          <div className="w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2 flex-col justify-center lg:text-left text-center">
            <h2 className="heading">Proud to be o ne of the nation Best</h2>
            <p className="text_para">
              {" "}
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words
            </p>
            <p className="text_para mt-[30px]">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words
            </p>
            <Link to="/">
              <button className="btn">Learn More</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
