import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import SearchBar from "../../ui/SearchBar";
import CourseBox, { Star } from "../_components/CourseBox";
import { useState } from "react";
import { Filter } from "lucide-react";
import { tempInstructorData } from "../_components/InstructorsList";
import ListContainer from "@/components/ui/ListContainer";
import InstructorBox from "../_components/InstructorBox";
import { useCourses } from "../hooks/useCourses";

const Courses = () => {
  const { courses, loadingCourses } = useCourses({ limit: 4 });
  const [openAccordion, setOpenAccordion] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? 0 : index);
  };

  return (
    <>
      <div className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        <div className="absolute top-2 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        <main className="px-5 py-2 md:px-10 md:py-5">
          <header className="my-5 flex flex-col justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
            <h1 className="text-2xl font-bold md:text-3xl">Explore Courses</h1>
            <SearchBar show placeholderText="Search courses..." />
          </header>

          {/* Main Content Grid */}
          <div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Filter Section */}
            <div className="col-span-3">
              <button className="flex items-center gap-1 rounded-lg border border-gray-700 px-3 py-[0.45rem]">
                <Filter size={18} />
                <span className="font-semibold">Filter</span>
              </button>

              <div className="mt-5 w-[20rem] md:w-full">
                {["Rating", "Number of Chapters", "Price", "Category"].map(
                  (title, index) => (
                    <div
                      key={index}
                      className="w-full border-b border-gray-500/40 py-1"
                    >
                      <button
                        className="flex w-full items-center justify-between py-2 text-left"
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
                                <div key={i} className="mt-2 flex gap-1">
                                  {Array.from({ length: 5 }).map((_, j) => (
                                    <Star
                                      key={j}
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
                  ),
                )}
              </div>
            </div>

            {/* Courses Section */}
            <div className="col-span-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {!loadingCourses &&
                courses.map((course) => (
                  <CourseBox key={course._id.toString()} course={course} />
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
        render={courses.map((course) => (
          <CourseBox key={course._id.toString()} course={course} />
        ))}
      />
    </>
  );
};

export default Courses;
