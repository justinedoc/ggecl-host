import { useState } from "react";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaQuoteLeft,
} from "react-icons/fa";
import logoDark from "@/assets/images/LOGO-dark.png";

const Testimonial = () => {
  const [index, setIndex] = useState(0);

  const totalTestimonials = 6;
  const testimonialsPerView = window.innerWidth >= 1024 ? 4 : 1;
  const maxIndex = totalTestimonials - testimonialsPerView;

  const prevSlide = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 py-10 px-4 md:px-16">
      <h1 className="text-3xl text-center md:text-left font-bold text-white">
        What our clients say about us
      </h1>

      <span className="flex gap-4 justify-end mb-4">
        <FaArrowAltCircleLeft
          onClick={prevSlide}
          className="text-4xl dark:text-gray-800 text-white cursor-pointer hover:scale-110 transition"
        />
        <FaArrowAltCircleRight
          onClick={nextSlide}
          className="text-4xl dark:text-gray-800 text-white cursor-pointer hover:scale-110 transition"
        />
      </span>

      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${index * (100 / testimonialsPerView)}%)`,
          }}
        >
          {Array(6)
            .fill("")
            .map((_, i) => (
              <div key={i} className="min-w-[100%] lg:min-w-[25%] px-2">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-start">
                  <FaQuoteLeft className="text-gray-500 text-2xl mb-3" />
                  <p className="text-left text-gray-700 dark:text-white">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Rem dicta sint, recusandae deleniti.
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <img
                      src={logoDark}
                      className="w-10 rounded-full bg-white"
                      alt="User"
                    />
                    <div className="text-left">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Josh Dickson
                      </h3>
                      <p className="text-xs text-gray-500">Programmer</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
