import profileImg from "@/assets/images/Frame 427319048.png";
import { FaPlayCircle, FaUserCircle } from "react-icons/fa";
import {Link} from "react-router-dom"

const features = [
  {
    id: 1,
    amount: "957",
    info: "Assigned Courses",
    icon: (
      <FaPlayCircle
        className="rounded-sm bg-blue-200 p-2 text-blue-600"
        size={40}
      />
    ),
    border: "border-blue-300 dark:border-blue-600",
  },

  {
    id: 4,
    amount: "789",
    info: "Total Students",
    icon: (
      <FaUserCircle
        className="rounded-sm bg-orange-200 p-2 text-orange-600"
        size={40}
      />
    ),
    border: "border-orange-300 dark:border-orange-600",
  },
];

const InstructorHome = () => {
  return (
    <div className="p-4 whitespace-nowrap">
      {/* Stats Section */}
      <div className="p-4">
        {/* First Row */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
          {features.slice(0, 3).map((feature) => (
            <div
              key={feature.id}
              className={`flex flex-row items-center gap-4 border shadow-md ${feature.border} rounded-md p-3`}
            >
              {feature.icon}
              <div className="whitespace-normal text-gray-700 dark:text-gray-300">
                <p className="text-xl">{feature.amount}</p>
                <p className="text-sm">{feature.info}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="mt-4 grid grid-cols-1 gap-4 whitespace-normal sm:grid-cols-2 md:grid-cols-5">
          {features.slice(3, 6).map((feature) => (
            <div
              key={feature.id}
              className={`flex flex-row items-center gap-4 border shadow-md ${feature.border} rounded-md p-3 whitespace-normal`}
            >
              {feature.icon}
              <div className="whitespace-normal text-gray-700 dark:text-gray-300">
                <p className="text-xl">{feature.amount}</p>
                <p className="text-sm">{feature.info}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Section */}
      <div className="mt-10 flex min-h-32 w-full flex-col items-center justify-start gap-6 bg-gray-800 px-6 py-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={profileImg}
            alt="Profile"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-white">Josh Dickson</p>
            <p className="text-sm text-gray-400">jodicksonjoshua@gmail.com</p>
          </div>
        </div>

        <Link to="/instructor/dashboard/settings" className="btn rounded-md px-4 py-2 text-white">
          Edit Bio
        </Link>
      </div>
    </div>
  );
};

export default InstructorHome;
