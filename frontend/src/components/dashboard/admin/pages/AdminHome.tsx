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

// Data & Types
interface StatCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
}

interface CtaBannerProps {
  title: string;
  description: string;
  link: string;
  icon: JSX.Element;
  colorClass: string;
}

const stats: StatCardProps[] = [
  {
    title: "Enrolled Students",
    value: 957,
    icon: <LucideGraduationCap className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Course Instructors",
    value: 241,
    icon: <LucideUsers className="h-8 w-8 text-purple-500" />,
  },
  {
    title: "Active Courses",
    value: 19,
    icon: <LucideBarChart3 className="h-8 w-8 text-yellow-500" />,
  },
];

const ctaBanners: CtaBannerProps[] = [
  {
    title: "Add New Student",
    description: "Easily onboard new learners to your platform.",
    link: "/admin/dashboard/students",
    icon: <LucideUserPlus className="h-6 w-6 text-blue-400" />,
    colorClass: "border border-blue-300 dark:border-blue-900 text-blue-700 dark:text-blue-300",
  },
  {
    title: "Invite Instructor",
    description: "Grow your teaching team with skilled professionals.",
    link: "/admin/dashboard/instructors",
    icon: <LucideUserRoundPlus className="h-6 w-6 text-blue-500" />,
    colorClass: "border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300",
  },
  {
    title: "Add Administrator",
    description: "Grant access to manage the platform effectively.",
    link: "/admin/dashboard/admins",
    icon: <LucideShieldPlus className="h-6 w-6 text-red-500" />,
    colorClass: "border border-red-100 dark:border-red-900 text-red-700 dark:text-red-300",
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 transition-all dark:bg-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your platform's key statistics and quick actions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800"
            whileHover={{ scale: 1.05 }}
          >
            {stat.icon}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {stat.value}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Banners */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

export default Dashboard;