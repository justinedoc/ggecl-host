import profileImg from "@/assets/images/Frame 427319048.png";
import { FaPlayCircle, FaUserCircle } from "react-icons/fa";
import {Link} from "react-router"

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

import { motion } from "framer-motion";

import {
  LucideGraduationCap,
  LucideUsers,
  LucideBarChart3,
  LucideUserPlus,
  LucideUserRoundPlus,
  LucideShieldPlus,
} from "lucide-react";
import { JSX } from "react";


interface CtaBannerProps {
  title: string;
  description: string;
  link: string;
  icon: JSX.Element;
  colorClass: string;
}

const ctaBanners: CtaBannerProps[] = [
  {
    title: "Schedula an Assignment",
    description: "Easily onboard new learners to your platform.",
    link: "/instructor/dashboard/check-assignments",
    icon: <LucideUserPlus className="h-6 w-6 text-blue-400" />,
    colorClass: "border border-blue-300 dark:border-blue-900 text-blue-700 dark:text-blue-300",
  },
  {
    title: "View My Courses",
    description: "Grow your teaching team with skilled professionals.",
    link: "/instructor/dashboard/courses",
    icon: <LucideUserRoundPlus className="h-6 w-6 text-blue-500" />,
    colorClass: "border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300",
  },
  {
    title: "View list of Students",
    description: "Grant access to manage the platform effectively.",
    link: "/instructor/dashboard/students",
    icon: <LucideShieldPlus className="h-6 w-6 text-red-500" />,
    colorClass: "border border-red-100 dark:border-red-900 text-red-700 dark:text-red-300",
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


      {/* CTA Banners */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-5">
              {ctaBanners.map((banner, index) => (
                <motion.div
                  key={index}
                  className={`rounded-lg p-6 shadow-md ${banner.colorClass} dark:border dark:border-gray-700`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-4">
                    {banner.icon}
                    <h3 className="ml-2 text-lg font-semibold">{banner.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {banner.description}
                  </p>
                  <motion.a
                    href={banner.link}
                    className="inline-block rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-50 shadow-sm hover:bg-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-600"
                    whileTap={{ scale: 0.95 }}
                  >
                    Go to {banner.title}
                  </motion.a>
                </motion.div>
              ))}
            </div>
    </div>
  );
};

export default InstructorHome;
