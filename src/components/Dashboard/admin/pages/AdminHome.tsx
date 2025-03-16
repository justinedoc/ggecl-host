import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { LucideGraduationCap, LucideUsers, LucideDollarSign, LucideBarChart3 } from "lucide-react";

// Data & Types
interface StatCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const stats: StatCardProps[] = [
  { title: "Enrolled Courses", value: 957, icon: <LucideGraduationCap className="text-blue-500 w-8 h-8" /> },
  { title: "Course Instructors", value: 241, icon: <LucideUsers className="text-purple-500 w-8 h-8" /> },
  { title: "Active Courses", value: 19, icon: <LucideBarChart3 className="text-yellow-500 w-8 h-8" /> },
  { title: "Total Earnings", value: "$7,461,767", icon: <LucideDollarSign className="text-green-500 w-8 h-8" /> },
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
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition-all">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div key={index} className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg flex items-center space-x-4" whileHover={{ scale: 1.05 }}>
            {stat.icon}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{stat.value}</h2>
              <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logged-in Users */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">Logged in users</h3>
          {users.map((user, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <p className="text-gray-700 dark:text-gray-300">{user.name}</p>
              <span className="text-gray-500 text-sm">{user.role}</span>
            </div>
          ))}
          <p className="text-blue-500 cursor-pointer mt-2">+84 more</p>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Revenue</h3>
            <p className="text-gray-500 text-sm cursor-pointer">This month ⌄</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Overall Course Rating */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Overall Course Rating</h3>
            <p className="text-gray-500 text-sm cursor-pointer">This week ⌄</p>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-4">4.6</h1>
          <p className="text-gray-500 text-sm">Overall Rating</p>
          {ratingsData.map((rating, i) => (
            <div key={i} className="flex items-center space-x-2 mt-2">
              <span className="text-yellow-500">{rating.stars}</span>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
                <div className="h-2 bg-blue-500 rounded" style={{ width: `${rating.percent}%` }}></div>
              </div>
              <span className="text-gray-500 text-sm">{rating.percent}%</span>
            </div>
          ))}
        </div>

        {/* Courses Overview */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Courses Overview</h3>
            <p className="text-gray-500 text-sm cursor-pointer">This week ⌄</p>
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
