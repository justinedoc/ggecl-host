import teacherImg from "@/assets/images/Asset3.png";
import studentImg from "@/assets/images/Asset2.png";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { useCustomNavigate } from "@/hooks/useCustomNavigate";

function JoinAs() {
  const { navigate } = useCustomNavigate();
  return (
    <section className="w-full p-5 md:p-12 bg-white dark:bg-gray-900 text-gray-800 dark:text-white space-y-8">
      <div className="flex flex-col md:flex-row justify-center items-center md:gap-16 gap-5">
        <div className="w-[20rem]">
          <img
            src={teacherImg}
            alt="Become an Instructor"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="w-full md:max-w-[35rem] flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
            Become an Instructor
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-300">
            Empower learners globally by sharing your expertise. Enjoy access to
            advanced tools and comprehensive resources designed to elevate your
            teaching experience.
          </p>
          <Button
            className="text-white font-semibold px-5 py-4 rounded-md btn w-fit inline-flex items-center"
            onClick={() => navigate("/instructor/login")}
          >
            Embark on Your Instructor Journey <FaArrowRight />
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row-reverse justify-center items-center gap-5 md:gap-16">
        <div className="w-[20rem]">
          <img
            src={studentImg}
            alt="Enroll as a Student"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="w-full md:w-1/2 md:pl-12 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
            Enroll as a Student
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-300">
            Access insights from industry leaders and world-class educational
            content. Begin your journey to mastering essential skills and
            advancing your career.
          </p>
          <Button className="text-white font-semibold px-5 py-4 rounded-md btn w-fit inline-flex items-center">
            Begin Your Learning Journey <FaArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default JoinAs;
