import { useEffect, useState } from "react";
import { FaClock, FaBook, FaTasks, FaPaintBrush } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { Calendar } from "@/components/ui/calendar";
import { LucidePaintbrush } from "lucide-react";

const StudentHome = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(0);

  const enrolledClasses = [
    {
      id: 1,
      title: "User Experience (UX) Design",
      time: "5:30hrs",
      lessons: "05 Lessons",
      icon: <FiBox className="text-gray-600 text-2xl" />,
      active: true,
    },
    {
      id: 2,
      title: "Visual Design and Branding",
      time: "4:00hrs",
      lessons: "03 Lessons",
      icon: <FaPaintBrush className="text-gray-600 text-2xl" />,
      active: false,
    },
    {
      id: 3,
      title: "Visual Design and Branding",
      time: "4:00hrs",
      lessons: "03 Lessons",
      icon: <FaPaintBrush className="text-gray-600 text-2xl" />,
      active: false,
    },
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: "UX Design Fundamentals",
      time: "5:30pm",
      active: true,
    },
    {
      id: 2,
      title: "Interaction Design",
      time: "9:00pm",
      active: false,
    },
    {
      id: 3,
      title: "Interaction Design",
      time: "9:00pm",
      active: false,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(50);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col gap-3 mb-10">
        <p className="text-4xl text-gray-800 dark:text-gray-200 font-bold">
          Hello Joshua
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Ready to learn today?
        </p>
      </div>

      <div className="flex md:flex-row flex-col-reverse gap-4 items-start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow-md dark:shadow-gray-800"
        />

        <div className="border border-gray-200 dark:border-gray-700 flex flex-col gap-3 p-4 rounded-lg shadow-md dark:shadow-gray-800 min-w-full md:min-w-[250px]">
          <p className="text-gray-800 dark:text-gray-200">
            Recent Enrolled Courses
          </p>
          <div className="border border-gray-200 dark:border-gray-700 flex flex-col gap-3 p-4 rounded-md">
            <LucidePaintbrush
              size={30}
              className="text-gray-800 dark:text-gray-200 bg-gray-200 p-2 rounded-sm text-4xl"
            />
            <p className="text-gray-800 dark:text-gray-200">
              Product Design Course
            </p>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              <span className="text-blue-600 font-bold">{progress}/100</span>{" "}
              progress
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-10 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md md:col-span-4 w-full">
          <p className="text-md font-bold text-gray-800 dark:text-gray-200 mb-3">
            Hours Spent
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md md:col-span-3 w-full">
          <p className="text-md font-bold text-gray-800 dark:text-gray-200 mb-3">
            Performance
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md md:col-span-3 w-full">
          <p className="text-md font-bold text-gray-800 dark:text-gray-200 mb-3">
            To-Do List
          </p>
          <div className="space-y-3">
            {[
              {
                title: "Human Interaction Designs",
                date: "Sunday, 30 June 2024",
              },
              { title: "Design System Basics", date: "Monday, 24 June 2024" },
              { title: "Introduction to UI", date: "Friday, 14 June 2024" },
              { title: "Basics of Figma", date: "Wednesday, 5 June 2024" },
            ].map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-b border-gray-300 dark:border-gray-700 p-2"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 appearance-none border border-gray-400 dark:border-gray-600 rounded-md checked:bg-blue-600 checked:border-transparent cursor-pointer transition"
                />
                <div>
                  <p className="text-gray-800 dark:text-gray-200">
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {task.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:p-2 p-1 grid md:grid-cols-5 grid-cols-1 gap-6 mt-14">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full col-span-1 md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Recent Enrolled Classes
            </h2>
            <span className="text-blue-600 cursor-pointer">All</span>
          </div>
          <div className=" h-40 overflow-y-scroll mf">
              {enrolledClasses.map((course) => (
                <div
                  key={course.id}
                  className={`p-4 rounded-lg border  ${
                    course.active
                      ? "border-blue-500 bg-blue-50 dark:bg-gray-900"
                      : "border-gray-200 dark:border-gray-700"
                  } flex items-center gap-4 mb-3`}
                >
                  <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md">
                    {course.icon}
                  </div>
                  <div>
                    <p
                      className={
                        course.active
                          ? "text-blue-600 font-semibold"
                          : "text-gray-800 dark:text-gray-200 font-semibold"
                      }
                    >
                      {course.title}
                    </p>
                    <div className="flex items-center gap-4 text-gray-600 text-sm mt-1">
                      <FaClock /> {course.time} <FaBook /> {course.lessons}{" "}
                      <FaTasks /> Assignments
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full md:col-span-2 col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Upcoming Lesson
          </h2>
          <div className=" h-40 overflow-y-scroll mf">
              {upcomingLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center mb-3 "
                >
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {lesson.title}
                    </p>
                    <p className="text-gray-600 text-sm">{lesson.time}</p>
                  </div>
                  <button
                    className={`px-4 py-1 text-sm rounded-md ${
                      lesson.active
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Join
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
