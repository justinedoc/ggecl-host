import { useState } from "react";
import { FaStar, FaClock, FaDownload, FaUsers, FaChevronDown, FaChevronRight } from "react-icons/fa";

const Video = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [openSections, setOpenSections] = useState<number[]>([0, 1, 2]); // Open all sections by default

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const courseContent = [
    {
      section: "Introduction to Digital Marketing",
      lessons: [
        "What is Digital Marketing?",
        "History & Evolution",
        "Digital vs Traditional Marketing",
        "Figma Introduction",
      ],
    },
    {
      section: "SEO Basics",
      lessons: ["SEO Fundamentals", "On-page SEO", "Off-page SEO"],
    },
    {
      section: "Content Marketing",
      lessons: ["Creating Engaging Content", "Content Strategy"],
    },
  ];

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 p-4">
        {/* Video Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-md">
            <video controls className="w-full rounded-md">
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="flex w-full justify-between items-center mt-4">
              <h2 className="text-2xl font-semibold">History & Evolution</h2>
              <div className="flex justify-center items-center gap-4 text-gray-600">
                <FaClock className="text-xl" />
                <FaDownload className="text-xl" />
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div>
            <div className="flex space-x-6 border-b dark:border-gray-700">
              {["overview", "assignments", "resources", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-lg font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-blue-500"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === "overview" && (
                <div>
                  <h3 className="text-lg font-semibold">Course Overview</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Learn the basics of digital marketing, including SEO, content marketing,
                    social media strategy, email marketing, and paid ads.
                  </p>
                  <div className="flex space-x-6 mt-4 text-gray-600 dark:text-gray-300">
                    <span className="flex items-center space-x-1">
                      <FaClock />
                      <span>51m</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FaStar className="text-yellow-500" />
                      <span>4.8</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FaUsers />
                      <span>854 students</span>
                    </span>
                  </div>
                </div>
              )}
              {activeTab === "assignments" && <p>Assignments will be shown here.</p>}
              {activeTab === "resources" && <p>Resources will be available here.</p>}
              {activeTab === "reviews" && <p>Reviews from students will be listed here.</p>}
            </div>
          </div>
        </div>

        {/* Sidebar - Accordion */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-md max-h-full overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            Course Contents{" "}
            <span className="text-green-500 text-sm font-normal">20% Completed</span>
            <input
              type="range"
              min="0"
              max="100"
              value="20"
              className="w-full h-2 appearance-none rounded-lg cursor-pointer
                bg-gradient-to-r from-green-500 to-white dark:to-gray-600/20
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-green-500
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:shadow
                [&::-moz-range-thumb]:bg-green-500
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-white
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:w-4"
            />
          </h3>
          <div className="divide-y dark:divide-gray-700">
            {courseContent.map((content, index) => (
              <div key={index} className="py-3">
                <button
                  onClick={() => toggleSection(index)}
                  className="flex items-center justify-between w-full text-left text-md font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-all duration-300"
                >
                  <span>{content.section}</span>
                  {openSections.includes(index) ? (
                    <FaChevronDown className="text-sm transition-transform duration-300" />
                  ) : (
                    <FaChevronRight className="text-sm transition-transform duration-300" />
                  )}
                </button>
                {openSections.includes(index) && (
                  <ul className="mt-2 pl-4 space-y-2 text-gray-600 dark:text-gray-300">
                    {content.lessons.map((lesson, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;