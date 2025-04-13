import { motion } from "framer-motion";

import {
  LucideGraduationCap,
  LucideUsers,
  LucideBarChart3,
} from "lucide-react";
import { JSX } from "react";

// Data & Types
interface StatCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
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

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 transition-all dark:bg-gray-900">
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
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
    </div>
  );
};

export default Dashboard;
