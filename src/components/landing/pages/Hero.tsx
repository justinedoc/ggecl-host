import { useEffect, useState } from "react";
import StudentHero from "@/components/landing/_components/StudentHero";
import sktech from "@/assets/images/sktech.svg";
import circle2 from "@/assets/images/circle2.png";
import "./styles/styles.css";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";

function Hero() {
  const [counts, setCounts] = useState({
    courses: 0,
    students: 0,
    caseStudies: 0,
    instructors: 0,
  });

  useEffect(() => {
    const targetCounts = {
      courses: 250,
      students: 5000,
      caseStudies: 120,
      instructors: 50,
    };
    let interval: NodeJS.Timeout;

    const animateCount = () => {
      interval = setInterval(() => {
        setCounts((prev) => ({
          courses: Math.min(prev.courses + 5, targetCounts.courses),
          students: Math.min(prev.students + 100, targetCounts.students),
          caseStudies: Math.min(prev.caseStudies + 3, targetCounts.caseStudies),
          instructors: Math.min(prev.instructors + 2, targetCounts.instructors),
        }));

        if (
          counts.courses >= targetCounts.courses &&
          counts.students >= targetCounts.students &&
          counts.caseStudies >= targetCounts.caseStudies &&
          counts.instructors >= targetCounts.instructors
        ) {
          clearInterval(interval);
        }
      }, 50);
    };

    animateCount();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between px-4 md:px-12 pt-5 pb-36 bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-full">
      <div className="w-full md:w-1/2 text-center md:text-left space-y-5">
        <div className="absolute top-16 -left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <h1 className="font-bold text-[1.7rem] mt-5 md:text-5xl leading-tight md:leading-snug">
          Empower your future with courses designed to
          <span className="text-blue-600 flex flex-col items-center md:items-start mt-2">
            <p>fit your choice.</p>
            <img
              src={sktech}
              alt="Decorative Sketch"
              className="w-44 md:w-56 -mt-3"
            />
          </span>
        </h1>

        <p className="text-md font-light md:text-xl leading-tighter">
          We bring together world-class instructors, interactive content, and a
          supportive community to help you achieve your personal and
          professional goals.
        </p>

        <Button className="text-white font-semibold px-5 py-5 rounded-md btn w-fit inline-flex items-center">
          Start your student journey <FaArrowRight />
        </Button>
      </div>

      <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0 md:ml-10">
        <StudentHero />
      </div>

      <div className="absolute md:top-24 hidden left-12 top-2/4 right-14 animate-spin-slow">
        <img
          src={circle2}
          alt="Spinning Design"
          className="w-24 h-24 md:w-28 md:h-28 md:mt-5 -mt-5"
        />
      </div>

      <div className="absolute left-0 md:bottom-2 bottom-4 text-center w-full md:px-6 px-2">
        <div className="flex  justify-center text-center bg-gray-50 dark:bg-gray-800 rounded-lg md:px-6 px-1 py-1 shadow-md">
          {[
            { label: "Courses", value: counts.courses, suffix: "+" },
            { label: "Students", value: counts.students, suffix: "+" },
            { label: "Case Studies", value: counts.caseStudies, suffix: "+" },
            { label: "Instructors", value: counts.instructors, suffix: "+" },
          ].map((item, index) => (
            <div key={index} className="w-1/2 md:w-1/4 py-4">
              <h3 className="md:text-2xl text-md font-bold dark:text-blue-100 text-gray-700">
                {item.value}
                {item.suffix}
              </h3>
              <p className="text-gray-800 dark:text-gray-100 md:text-xl text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;
