import teacherImg from "@/assets/images/Asset3.png";
import studentImg from "@/assets/images/Asset2.png";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";

function JoinAs() {
  return (
    <section className="w-full p-5 md:p-12 bg-white dark:bg-gray-900 text-gray-800 dark:text-white space-y-8">
      <div className="flex flex-col md:flex-row justify-center items-center md:gap-16 gap-5">
        <div className="w-[20rem]">
          <img
            src={teacherImg}
            alt="Join as a Teacher"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="w-full md:max-w-[35rem] flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
            Join as a Teacher
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-300">
            Share your knowledge and inspire thousands of students worldwide.
            Get access to tools and resources to enhance your teaching
            experience.
          </p>
          <Button className="text-white font-semibold px-5 py-4 rounded-md btn w-fit inline-flex items-center">
            Start Your Instructor Journey <FaArrowRight />
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row-reverse justify-center items-center gap-5 md:gap-16">
        <div className="w-[20rem]">
          <img
            src={studentImg}
            alt="Join as a Student"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="w-full md:w-1/2 md:pl-12 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
            Join as a Student
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-300">
            Learn from industry experts, access world-class content, and develop
            skills that matter. Take control of your learning journey today!
          </p>
          <Button className="text-white font-semibold px-5 py-4 rounded-md btn w-fit inline-flex items-center">
            Start Learning <FaArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default JoinAs;
