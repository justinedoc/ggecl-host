import Navbar from "../_components/Navbar";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { tempCourseData } from "../_components/CoursesList";
import SearchBar from "../../ui/SearchBar";
import CourseBox, { Star } from "../_components/CourseBox";
import Footer from "./Footer";
import { useState } from "react";
import { Filter } from "lucide-react";
import { tempInstructorData } from "../_components/InstructorsList";
import ListContainer from "@/components/ui/ListContainer";
import InstructorBox from "../_components/InstructorBox";

const Courses = () => {
  const [openAccordion, setOpenAccordion] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? 0 : index);
  };

  return (
    <>
      <div className="bg-white text-gray-800 dark:text-gray-100 dark:bg-gray-900">
        <Navbar showNav />

        <div className="absolute top-2 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <main className="md:py-5 md:px-10 px-5 py-2">
          <header className="flex flex-col md:flex-row justify-between md:items-center space-y-3 md:space-y-0 my-5">
            <h1 className="md:text-3xl text-2xl font-bold">Explore Courses</h1>
            <SearchBar show />
          </header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
            {/* Filter Section */}
            <div className="col-span-3">
              <button className="flex items-center gap-1 border border-gray-700 rounded-lg px-3 py-[0.45rem]">
                <Filter size={18} />
                <span className="font-semibold">Filter</span>
              </button>

              <div className="mt-5 md:w-full w-[20rem]">
                {["Rating", "Number of Chapters", "Price", "Category"].map(
                  (title, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-500/40 py-1 w-full"
                    >
                      <button
                        className="flex justify-between items-center w-full text-left py-2"
                        onClick={() => toggleAccordion(index)}
                      >
                        {title}
                        {openAccordion === index ? (
                          <FaChevronUp size={13} />
                        ) : (
                          <FaChevronDown size={13} />
                        )}
                      </button>
                      {openAccordion === index && (
                        <div className="flex flex-col-reverse">
                          {index === 0 && (
                            <>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex gap-1 mt-2">
                                  {Array.from({ length: 5 }).map((_, j) => (
                                    <Star
                                      className="size-6"
                                      full={j + 1 <= i + 1}
                                    />
                                  ))}
                                </div>
                              ))}
                            </>
                          )}
                          {index === 1 && (
                            <div className="space-y-2">
                              <label className="block">
                                <input type="checkbox" /> 1-10
                              </label>
                              <label className="block">
                                <input type="checkbox" /> 10-15
                              </label>
                              <label className="block">
                                <input type="checkbox" /> 1-10
                              </label>
                              <label className="block">
                                <input type="checkbox" /> 10-15
                              </label>
                              <label className="block">
                                <input type="checkbox" /> 1-10
                              </label>
                              <label className="block">
                                <input type="checkbox" /> 10-15
                              </label>
                            </div>
                          )}
                          {index === 2 && (
                            <div className="space-y-2">
                              <label className="block">
                                <input type="checkbox" /> $100
                              </label>
                              <label className="block">
                                <input type="checkbox" /> $150
                              </label>
                              <label className="block">
                                <input type="checkbox" /> $100
                              </label>
                              <label className="block">
                                <input type="checkbox" /> $150
                              </label>
                              <label className="block">
                                <input type="checkbox" /> $100
                              </label>
                              <label className="block">
                                <input type="checkbox" /> $150
                              </label>
                            </div>
                          )}
                          {index === 3 && (
                            <div className="space-y-2 text-gray-500">
                              <label className="block">Web Development</label>
                              <label className="block">App Development</label>
                              <label className="block">Web Development</label>
                              <label className="block">App Development</label>
                              <label className="block">Web Development</label>
                              <label className="block">App Development</label>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Courses Section */}
            <div className="col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tempCourseData.map((course) => (
                <CourseBox key={course.id} course={course} />
              ))}
            </div>
          </div>
        </main>
      </div>
      <ListContainer
        header="Popular Mentors"
        path="/instructors"
        render={tempInstructorData.map((instructor) => (
          <InstructorBox key={instructor.id} instructor={instructor} />
        ))}
      />
      <ListContainer
        header="Featured Courses"
        path="/courses"
        render={tempCourseData.map((course) => (
          <CourseBox key={course.id} course={course} />
        ))}
      />
      <Footer />
    </>
  );
};

export default Courses;
