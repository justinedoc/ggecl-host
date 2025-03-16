import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const courses = [
  { id: 1, title: "Ultimate Design App Training", lesson: "1. Introduction", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 100 },
  { id: 2, title: "React for Beginners", lesson: "2. JSX & Components", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 75 },
  { id: 3, title: "Advanced UI/UX Principles", lesson: "3. Wireframing", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 100 },
  { id: 4, title: "Full-Stack Development", lesson: "4. Backend Basics", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 90 },
  { id: 5, title: "Building Scalable Systems", lesson: "5. Architecture", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 30 },
  { id: 6, title: "JavaScript Algorithms", lesson: "6. Data Structures", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 100 },
  { id: 7, title: "Mobile App Development", lesson: "7. React Native", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 60 },
  { id: 8, title: "Cybersecurity Essentials", lesson: "8. Encryption", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 100 },
  { id: 9, title: "AI & Machine Learning", lesson: "9. Neural Networks", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 40 },
  { id: 10, title: "Cloud Computing Basics", lesson: "10. AWS & GCP", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg", progress: 100 },
];

const ITEMS_PER_PAGE = 8;

const StudentCourses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompleted] = useState(false);
  const [sortOrder] = useState("asc");

  const filteredCourses = courses
    .filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (!filterCompleted || course.progress === 100)
    )
    .sort((a, b) => sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-2 md:p-8 mb-32">
        <div className="flex flex-row gap-2 mt-4 mb-10 items-center">
            <h1 className="text-2xl font-bold">Courses</h1><span className="text-xl">(957)</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex flex-col gap-2 w-full md:max-w-lg">
            <label htmlFor="filter">Search</label>
            <div className="relative w-full md:max-w-lg">
              <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
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
          <div className="flex flex-col gap-2 md:w-max w-full">
            <label htmlFor="filter">By completion</label>
              <select className="w-full sm:w-auto pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500" id="filter">
                <option className="bg-gray-200 dark:bg-gray-900">Filter by Completion</option>
                <option className="bg-gray-200 dark:bg-gray-900">Completed</option>
                <option className="bg-gray-200 dark:bg-gray-900">In Progress</option>
              </select>
          </div>
          <div className="flex flex-col gap-2 md:w-max w-full">
            <label htmlFor="filter">By category</label>
              <select className="w-full sm:w-auto pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                <option className="bg-gray-200 dark:bg-gray-900">Category</option>
                <option className="bg-gray-200 dark:bg-gray-900">Development</option>
                <option className="bg-gray-200 dark:bg-gray-900">Design</option>
              </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
        {currentCourses.map((course) => (
          <div key={course.id} className="relative border border-gray-200 dark:border-gray-800 shadow-md rounded-lg overflow-hidden min-w-60 mt-5">
            <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{course.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{course.lesson}</p>
              <div className="flex items-center justify-between mt-3">
                
                <button
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md font-semibold transition-all  ${course.progress === 100 ? "btn w-full text-gray-50" : "dark:bg-gray-800 dark:hover:bg-gray-700 bg-gray-200 hover:bg-gray-300"}`}
                >
                  {course.progress === 100 ? "Watch Again" : "Continue"}
                </button>
                {course.progress !== 100 && (
                  <div className="text-green-600 text-sm">{course.progress}% completed</div>
                )}
              </div>
              {course.progress !== 100 ? <div className="w-full bg-gray-300 dark:bg-gray-700 h-1 rounded-full mt-4 absolute bottom-0 right-0 left-0">
                <div
                  className="h-1 rounded-full bg-green-600"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div> : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-14">
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-2 mx-2 bg-gray-300 dark:bg-gray-800 rounded-md disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
        <button 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-2 mx-2 bg-gray-300 dark:bg-gray-800 rounded-md disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default StudentCourses;
