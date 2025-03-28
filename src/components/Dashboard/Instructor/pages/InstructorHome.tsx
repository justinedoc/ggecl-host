import {
  FaPlayCircle,
  FaCheckSquare,
  FaAward,
  FaUserCircle,
  FaCreditCard,
  FaLayerGroup,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import profileImg from "@/assets/images/Frame 427319048.png";
import CourseRating from "../_components/CourseRating";

const recentActivity = [
  {
    user: "Kevin",
    action: "commented on your lecture",
    course: "What is UI in Figma?",
    time: "Just now",
  },
  {
    user: "John",
    action: "gave a 5-star rating",
    course: "2021 UI/UX design with Figma",
    time: "5 mins ago",
  },
  {
    user: "Kevin",
    action: "commented on your lecture",
    course: "What is UI in Figma?",
    time: "Just now",
  },
  {
    user: "Sraboni",
    action: "purchased your course",
    course: "2021 UI/UX design with Figma",
    time: "6 mins ago",
  },
];

const revenueData = [
  { date: "Aug 01", revenue: 750000 },
  { date: "Aug 7", revenue: 75000 },
  { date: "Aug 9", revenue: 750000 },
  { date: "Aug 12", revenue: 51749 },
  { date: "Aug 20", revenue: 650000 },
  { date: "Aug 31", revenue: 800000 },
];

const profileViews = [
  { day: "Mon", views: 500 },
  { day: "Tue", views: 700 },
  { day: "Wed", views: 400 },
  { day: "Thu", views: 900 },
  { day: "Fri", views: 650 },
  { day: "Sat", views: 800 },
  { day: "Sun", views: 750 },
];

const features = [
  {
    id: 1,
    amount: "957",
    info: "Enrolled Courses",
    icon: (
      <FaPlayCircle
        className="text-blue-600 bg-blue-200 p-2 rounded-sm"
        size={40}
      />
    ),
    border: "border-blue-300 dark:border-blue-600",
  },
  {
    id: 2,
    amount: "967",
    info: "Mid Courses",
    icon: (
      <FaCheckSquare
        className="text-purple-600 bg-purple-200 p-2 rounded-sm"
        size={40}
      />
    ),
    border: "border-purple-300 dark:border-purple-600",
  },
  {
    id: 3,
    amount: "657",
    info: "Unenrolled Courses",
    icon: (
      <FaAward
        className="text-green-600 bg-green-200 p-2 rounded-sm"
        size={40}
      />
    ),
    border: "border-green-300 dark:border-green-600",
  },
  {
    id: 4,
    amount: "789",
    info: "Total Users",
    icon: (
      <FaUserCircle
        className="text-orange-600 bg-orange-200 p-2 rounded-sm"
        size={40}
      />
    ),
    border: "border-orange-300 dark:border-orange-600",
  },
  {
    id: 5,
    amount: "325",
    info: "Payments Received",
    icon: (
      <FaCreditCard
        className="text-pink-600 bg-pink-200 p-2 rounded-sm"
        size={40}
      />
    ),
    border: "border-pink-300 dark:border-pink-600",
  },
  {
    id: 6,
    amount: "412",
    info: "Total Modules",
    icon: (
      <FaLayerGroup
        className="text-red-600 bg-red-200 p-2 rounded-sm"
        size={40}
      />
    ),
    border: "border-red-300 dark:border-red-600",
  },
];

const InstructorHome = () => {
  return (
    <div className="whitespace-nowrap p-4">
      {/* Stats Section */}
      <div className="p-4">
        {/* First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 mt-10 gap-4">
          {features.slice(0, 3).map((feature) => (
            <div
              key={feature.id}
              className={`flex flex-row gap-4 items-center border shadow-md ${feature.border} rounded-md p-3`}
            >
              {feature.icon}
              <div className="text-gray-700 dark:text-gray-300  whitespace-normal">
                <p className="text-xl">{feature.amount}</p>
                <p className="text-sm">{feature.info}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 mt-4 gap-4 whitespace-normal">
          {features.slice(3, 6).map((feature) => (
            <div
              key={feature.id}
              className={`flex flex-row gap-4 items-center border shadow-md ${feature.border} rounded-md p-3  whitespace-normal`}
            >
              {feature.icon}
              <div className="text-gray-700 dark:text-gray-300  whitespace-normal">
                <p className="text-xl">{feature.amount}</p>
                <p className="text-sm">{feature.info}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-gray-800 w-full flex flex-col md:flex-row items-center md:justify-between justify-start min-h-32 mt-10 px-6 py-4 gap-6">
        <div className="flex items-center gap-4">
          <img
            src={profileImg}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="text-white font-semibold">Josh Dickson</p>
            <p className="text-gray-400 text-sm">jodicksonjoshua@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <p className="text-gray-400">1/4 steps</p>
          <div className="bg-gray-700 rounded min-h-5 w-60 relative overflow-hidden">
            <span className="bg-green-500 absolute min-h-5 top-0 left-0 w-1/4 rounded-l-sm"></span>
          </div>
          <p className="text-gray-200 font-bold">25% Completed</p>
        </div>
        <button className="btn rounded-md px-4 py-2 text-white">
          Edit Biography
        </button>
      </div>

      {/* Dashboard Charts and Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-md">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          {recentActivity.map((activity, index) => (
            <div key={index} className="border-b py-2 overflow-x-scroll lm">
              <p className="text-sm  overflow-x-scroll lm">
                <span className="font-semibold  overflow-x-scroll lm">{activity.user}</span>{" "}
                {activity.action}{" "}
                <span className="text-blue-500  overflow-x-scroll lm">{activity.course}</span>
              </p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-md">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profile Views */}
        <div className="bg-white dark:bg-gray-900 shadow-md p-4 rounded-md">
          <h3 className="text-lg font-semibold">Profile Views</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={profileViews}>
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="views" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-gray-500 font-semibold text-center">
            $7,443 earned
          </p>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 md:gap-4 w-full justify-between">
          {/* Overall Course Rating */}
          <div className="">
      <CourseRating
        overallRating={4.6}
        ratingsDistribution={[
          { stars: 5, percentage: 56 },
          { stars: 4, percentage: 37 },
          { stars: 3, percentage: 8 },
          { stars: 2, percentage: 1 },
          { stars: 1, percentage: 0.5 },
        ]}
      />
    </div>
          {/* Course Overview */}
          <div className="mt-10 bg-white dark:bg-gray-900 shadow-md p-4 rounded-md">
            <h3 className="text-lg font-semibold">Course Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorHome;
