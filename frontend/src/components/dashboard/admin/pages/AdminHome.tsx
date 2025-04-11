import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  LucideGraduationCap,
  LucideUsers,
  LucideDollarSign,
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
    title: "Enrolled Courses",
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
  {
    title: "Total Earnings",
    value: "$7,461,767",
    icon: <LucideDollarSign className="h-8 w-8 text-green-500" />,
  },
];

const revenueData = [
  { name: "Aug 1", revenue: 51749 },
  { name: "Aug 7", revenue: 60432 },
  { name: "Aug 14", revenue: 72350 },
  { name: "Aug 21", revenue: 81500 },
  { name: "Aug 28", revenue: 93000 },
];

const coursesOverviewData = [
  { name: "Sun", courses: 50000 },
  { name: "Mon", courses: 450000 },
  { name: "Tue", courses: 300000 },
  { name: "Wed", courses: 400000 },
  { name: "Thu", courses: 350000 },
  { name: "Fri", courses: 500000 },
  { name: "Sat", courses: 200000 },
];

const ratingsData = [
  { stars: "★★★★★", percent: 56 },
  { stars: "★★★★☆", percent: 26 },
  { stars: "★★★☆☆", percent: 8 },
  { stars: "★★☆☆☆", percent: 7 },
  { stars: "★☆☆☆☆", percent: 1 },
];

const users = [
  { name: "John Doe", role: "HR Manager" },
  { name: "John Doe", role: "HR Manager" },
  { name: "John Doe", role: "HR Manager" },
  { name: "John Doe", role: "HR Manager" },
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Logged-in Users */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Logged in users
          </h3>
          {users.map((user, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <p className="text-gray-700 dark:text-gray-300">{user.name}</p>
              <span className="text-sm text-gray-500">{user.role}</span>
            </div>
          ))}
          <p className="mt-2 cursor-pointer text-blue-500">+84 more</p>
        </div>

        {/* Revenue Chart */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Revenue
            </h3>
            <p className="cursor-pointer text-sm text-gray-500">This month ⌄</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Overall Course Rating */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Overall Course Rating
            </h3>
            <p className="cursor-pointer text-sm text-gray-500">This week ⌄</p>
          </div>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            4.6
          </h1>
          <p className="text-sm text-gray-500">Overall Rating</p>
          {ratingsData.map((rating, i) => (
            <div key={i} className="mt-2 flex items-center space-x-2">
              <span className="text-yellow-500">{rating.stars}</span>
              <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2 rounded bg-blue-500"
                  style={{ width: `${rating.percent}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-500">{rating.percent}%</span>
            </div>
          ))}
        </div>

        {/* Courses Overview */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Courses Overview
            </h3>
            <p className="cursor-pointer text-sm text-gray-500">This week ⌄</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={coursesOverviewData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="courses" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
