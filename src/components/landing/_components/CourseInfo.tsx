import { useState, useMemo } from "react";
import { FaAward, FaGraduationCap, FaPlay, FaStar } from "react-icons/fa";
import SyllabusAccordion from "./SyllabusAccordion";
import { CourseType } from "./CourseBox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateInitials } from "@/lib/generateInitial";

const tabs = ["All", "Description", "Instructor", "Syllabus", "Reviews"];

const CourseInfo: React.FC<CourseType> = ({ course }) => {
  const [activeTab, setActiveTab] = useState<string>("All");

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "All":
        return (
          <>
            <CourseDescription description={course.description} />
            <InstructorInfo instructor={course.instructor} />
            <SyllabusAccordion />
            <StudentReviews reviews={course.reviews} />
          </>
        );
      case "Description":
        return <CourseDescription description={course.description} />;
      case "Instructor":
        return <InstructorInfo instructor={course.instructor} />;
      case "Syllabus":
        return <SyllabusAccordion />;
      case "Reviews":
        return <StudentReviews reviews={course.reviews} />;
      default:
        return null;
    }
  }, [activeTab, course]);

  return (
    <article className="p-4 md:p-6 w-full mx-auto bg-white dark:bg-gray-900">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <Separator className="md:w-[65%] w-full my-4" />
      <div className="mt-2">{renderTabContent}</div>
    </article>
  );
};

const TabNavigation: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ activeTab, setActiveTab }) => (
  <div className="flex gap-4 md:w-[65%] w-full overflow-x-auto">
    {tabs.map((tab) => (
      <Button
        variant={"ghost"}
        key={tab}
        className={`text-sm transition duration-100  border-gray-200/40 dark:border-blue-300/20 dark:hover:bg-gray-800 ${
          activeTab === tab
            ? "font-semibold bg-[#eff6ff] border-transparent dark:bg-gray-800"
            : "text-gray-500 dark:text-gray-400 border"
        }`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </Button>
    ))}
  </div>
);

// Course Description
const CourseDescription: React.FC<{ description: string }> = ({
  description,
}) => (
  <section>
    <h2 className="text-xl mb-3 font-bold text-gray-800 dark:text-gray-200">
      Course Description
    </h2>
    <p className="w-full md:w-[65%] leading-7 text-gray-700 dark:text-gray-300">
      {description}
    </p>
    <Separator className="w-full md:w-[65%] my-6" />
  </section>
);

// Instructor Information
const InstructorInfo: React.FC<{
  instructor: CourseType["course"]["instructor"];
}> = ({ instructor }) => (
  <section>
    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 my-3">
      Instructor
    </h2>
    <div className="my-2">
      <h3 className="font-bold text-blue-500">{instructor.name}</h3>
      <span className="text-sm font-semibold text-gray-500">
        {instructor.role}
      </span>
    </div>
    <div className="flex items-center my-5 gap-6">
      <img
        src={instructor.image}
        className="w-24 h-24 object-cover rounded-full"
        alt={instructor.name}
      />
      <div className="flex flex-col gap-2 text-sm">
        <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <FaAward /> {instructor.reviews} Reviews
        </p>
        <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <FaGraduationCap /> {instructor.students} Students
        </p>
        <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <FaPlay /> {instructor.courses} Courses
        </p>
      </div>
    </div>
    <p className="mt-6 text-gray-700 dark:text-gray-300 w-full md:w-[65%] leading-7">
      {instructor.bio}
    </p>
    <Separator className="my-7 w-full md:w-[65%]" />
  </section>
);

const StudentReviews: React.FC<{
  reviews: CourseType["course"]["reviews"];
}> = ({ reviews }) => {
  return (
    <section className="flex-col md:flex-row flex my-4 md:gap-16">
      <header>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-5">
          Learner Reviews
        </h2>

        {/* Total stars and reviews  */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="flex items-center">
            <span className="text-4xl font-bold mr-2">4.6</span>
            <div className="flex items-center mr-4">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-gray-300" />
            </div>
            <span className="text-gray-500 text-sm">(146,951 reviews)</span>
          </div>
        </div>

        {/* Star levels */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="flex-1 space-y-2">
            {/* 5 Star */}
            <div className="flex items-center gap-2">
              <span className="text-sm inline-flex gap-1 items-center font-medium">
                5 <FaStar className="text-yellow-400" />
              </span>
              <div className="bg-gray-200 w-full h-2 rounded">
                <div
                  className="bg-yellow-400 h-2 rounded"
                  style={{ width: "80%" }}
                />
              </div>
              <span className="text-sm text-gray-600">80%</span>
            </div>
            {/* 4 Star */}
            <div className="flex items-center gap-2">
              <span className="text-sm inline-flex gap-1 items-center font-medium">
                4 <FaStar className="text-yellow-400" />
              </span>
              <div className="bg-gray-200 w-full h-2 rounded">
                <div
                  className="bg-yellow-400 h-2 rounded"
                  style={{ width: "10%" }}
                />
              </div>
              <span className="text-sm text-gray-600">10%</span>
            </div>
            {/* 3 Star */}
            <div className="flex items-center gap-2">
              <span className="text-sm inline-flex gap-1 items-center font-medium">
                3 <FaStar className="text-yellow-400" />
              </span>
              <div className="bg-gray-200 w-full h-2 rounded">
                <div
                  className="bg-yellow-400 h-2 rounded"
                  style={{ width: "7%" }}
                />
              </div>
              <span className="text-sm text-gray-600">7%</span>
            </div>
            {/* 2 Star */}
            <div className="flex items-center gap-2">
              <span className="text-sm inline-flex gap-1 items-center font-medium">
                2 <FaStar className="text-yellow-400" />
              </span>
              <div className="bg-gray-200 w-full h-2 rounded">
                <div
                  className="bg-yellow-400 h-2 rounded"
                  style={{ width: "2%" }}
                />
              </div>
              <span className="text-sm text-gray-600">2%</span>
            </div>
            {/* 1 Star */}
            <div className="flex items-center gap-2">
              <span className="text-sm inline-flex gap-1 items-center font-medium">
                1 <FaStar className="text-yellow-400" />
              </span>
              <div className="bg-gray-200 w-full h-2 rounded">
                <div
                  className="bg-yellow-400 h-2 rounded"
                  style={{ width: "1%" }}
                />
              </div>
              <span className="text-sm text-gray-600">1%</span>
            </div>
          </div>
        </div>
      </header>

      {/* student Reviews */}
      <div className="mt-6 space-y-6 ">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="border dark:border-blue-300/30 rounded-md p-5 flex flex-col md:flex-row gap-6"
          >
            <div className="flex gap-4">
              <Avatar className="object-cover">
                <AvatarImage src={review.image} />
                <AvatarFallback>
                  {generateInitials(review.reviewer)}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold">{review.reviewer}</p>
            </div>

            <div className="max-w-[30rem] flex flex-col gap-3">
              <div className="flex gap-1 items-center">
                {/* 5 Stars */}
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <FaStar className="text-yellow-400" />
                <span className="ml-4 text-sm text-gray-500">
                  Reviewed on {review.date}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-7">
                {review.comment}
              </p>
            </div>
          </div>
        ))}

        <div className="mt-6">
          <Button
            variant={"outline"}
            className="bg-transparent dark:hover:bg-gray-800 font-semibold"
          >
            View more Reviews
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CourseInfo;
