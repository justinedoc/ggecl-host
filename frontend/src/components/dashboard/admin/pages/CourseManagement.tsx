import { Search, ChevronLeft, ChevronRight, Star, Award } from "lucide-react";
import { useState } from "react";

const courses = [
  {
    id: 1,
    category: "Comb",
    title: "Ultimate Design App Training",
    lesson: "1. Introduction",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 100,
  },
  {
    id: 2,
    category: "Comb",
    title: "React for Beginners",
    lesson: "2. JSX & Components",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 75,
  },
  {
    id: 3,
    category: "Comb",
    title: "Advanced UI/UX Principles",
    lesson: "3. Wireframing",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 100,
  },
  {
    id: 4,
    category: "Comb",
    title: "Full-Stack Development",
    lesson: "4. Backend Basics",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 90,
  },
  {
    id: 5,
    category: "Comb",
    title: "Building Scalable Systems",
    lesson: "5. Architecture",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 30,
  },
  {
    id: 6,
    category: "Comb",
    title: "JavaScript Algorithms",
    lesson: "6. Data Structures",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 100,
  },
  {
    id: 7,
    category: "Comb",
    title: "Mobile App Development",
    lesson: "7. React Native",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 60,
  },
  {
    id: 8,
    category: "Comb",
    title: "Cybersecurity Essentials",
    lesson: "8. Encryption",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 100,
  },
  {
    id: 9,
    category: "Comb",
    title: "AI & Machine Learning",
    lesson: "9. Neural Networks",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 40,
  },
  {
    id: 10,
    category: "Comb",
    title: "Cloud Computing Basics",
    lesson: "10. AWS & GCP",
    image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg",
    stars: "4.5",
    users: "10",
    amount: "$89.00",
    progress: 100,
  },
];

const ITEMS_PER_PAGE = 8;

const CourseManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompleted] = useState(false);
  const [sortOrder] = useState("asc");

  const filteredCourses = courses
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filterCompleted || course.progress === 100),
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title),
    );

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="mb-32 p-2 md:p-8">
      <div className="mt-4 mb-10 flex flex-row items-center gap-2">
        <h1 className="text-2xl font-bold">Courses</h1>
        <span className="text-xl">(957)</span>
      </div>
      <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex w-full flex-col gap-2 md:max-w-lg">
          <label htmlFor="filter">Search</label>
          <div className="relative w-full md:max-w-lg">
            <Search
              className="absolute top-2.5 left-3 text-gray-500 dark:text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-transparent py-2 pr-4 pl-10 focus:ring-2 focus:ring-gray-500 focus:outline-none dark:border-gray-700"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:justify-end">
          {/* <div className="flex flex-col gap-2 md:w-max w-full">
        <label htmlFor="title">By title</label>
              <select className="w-full sm:w-auto pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" id="title">
                <option className="bg-gray-200 dark:bg-gray-900">Sort By</option>
                <option className="bg-gray-200 dark:bg-gray-900">Progress</option>
                <option className="bg-gray-200 dark:bg-gray-900">Title</option>
              </select>
          </div> */}
          <div className="flex w-full flex-col gap-2 md:w-max">
            <label htmlFor="filter">By completion</label>
            <select
              className="w-full rounded-md border border-gray-300 bg-transparent py-2 pr-10 pl-3 focus:ring-2 focus:ring-gray-500 focus:outline-none sm:w-auto dark:border-gray-700"
              id="filter"
            >
              <option className="bg-gray-200 dark:bg-gray-900">
                Filter by Completion
              </option>
              <option className="bg-gray-200 dark:bg-gray-900">
                Completed
              </option>
              <option className="bg-gray-200 dark:bg-gray-900">
                In Progress
              </option>
            </select>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-max">
            <label htmlFor="filter">By category</label>
            <select className="w-full rounded-md border border-gray-300 bg-transparent py-2 pr-10 pl-3 focus:ring-2 focus:ring-gray-500 focus:outline-none sm:w-auto dark:border-gray-700">
              <option className="bg-gray-200 dark:bg-gray-900">Category</option>
              <option className="bg-gray-200 dark:bg-gray-900">
                Development
              </option>
              <option className="bg-gray-200 dark:bg-gray-900">Design</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentCourses.map((course) => (
          <div
            key={course.id}
            className="relative mt-5 min-w-60 overflow-hidden rounded-lg border border-gray-200 shadow-md dark:border-gray-800"
          >
            <img
              src={course.image}
              alt={course.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <p className="w-max items-center justify-center rounded-full border bg-purple-100 px-2 text-sm text-purple-600">
                {course.category}
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {course.title}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <hr />
                <div className="w-full">
                  <hr />
                  <div className="flex flex-row justify-between gap-4 py-2">
                    <p className="flex flex-row items-center gap-2">
                      <Star size="14" className="" />
                      <span>{course.stars}</span>
                    </p>

                    <div className="">
                      <p className="flex flex-row items-center gap-2">
                        <Award size="14" />{" "}
                        <span className="">{course.users}</span>
                        <span className="">students</span>
                      </p>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
            <p className="mb-5 ml-5">{course.amount}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex items-center justify-center">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="mx-2 rounded-md bg-gray-300 px-3 py-2 disabled:opacity-50 dark:bg-gray-800"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="mx-2 rounded-md bg-gray-300 px-3 py-2 disabled:opacity-50 dark:bg-gray-800"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CourseManagement;
