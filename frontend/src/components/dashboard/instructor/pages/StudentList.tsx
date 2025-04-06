import { useState } from "react";

type StatusType = "Pending" | "Active" | "Completed" | "Inactive" | "Withdrawn";

interface Student {
  name: string;
  email: string;
  phone: string;
  date: string;
  progress: string;
  status: StatusType;
}

const statusClasses: Record<StatusType, string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-600/20 dark:text-yellow-400",
  Active: "bg-blue-100 text-blue-800 dark:bg-blue-600/20 dark:text-blue-400",
  Completed: "bg-green-100 text-green-800 dark:bg-green-600/20 dark:text-green-400",
  Inactive: "bg-gray-200 text-gray-800 dark:bg-gray-600/30 dark:text-gray-300",
  Withdrawn: "bg-pink-100 text-pink-800 dark:bg-pink-600/20 dark:text-pink-400",
};

const data: Student[] = [
  {
    name: "Ada Johnson",
    email: "ada@email.com",
    phone: "+44 7911 123456",
    date: "01.01.2022",
    progress: "0%",
    status: "Pending",
  },
  {
    name: "Ada Johnson",
    email: "ada@email.com",
    phone: "+44 7911 123456",
    date: "01.01.2022",
    progress: "75%",
    status: "Active",
  },
  {
    name: "Ada Johnson",
    email: "ada@email.com",
    phone: "+44 7911 123456",
    date: "01.01.2022",
    progress: "100%",
    status: "Completed",
  },
  {
    name: "Ada Johnson",
    email: "ada@email.com",
    phone: "+44 7911 123456",
    date: "01.01.2022",
    progress: "75%",
    status: "Inactive",
  },
  {
    name: "Ada Johnson",
    email: "ada@email.com",
    phone: "+44 7911 123456",
    date: "01.01.2022",
    progress: "25%",
    status: "Withdrawn",
  },
  {
    name: "Ada Johnson",
    email: "ada@email.com",
    phone: "+44 7911 123456",
    date: "01.01.2022",
    progress: "0%",
    status: "Pending",
  },
  {
    name: "Ada Johnson",
    email: "ada@email.com",
    phone: "+2348123456789",
    date: "01.01.2022",
    progress: "100%",
    status: "Active",
  },
];

const StudentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredData: Student[] = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 md:p-4 bg-white dark:bg-gray-900 min-h-screen word-">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <select className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <option>Department</option>
          </select>
          <select className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <option>Status</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Student Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Phone Number</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Enrolment Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Progress</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {filteredData.map((student) => (
              <tr key={student.email} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-4 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{student.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{student.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{student.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{student.date}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{student.progress}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[student.status]}`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Show rows:
          <select className="ml-2 border rounded-md px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div className="flex space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <button className="px-2 py-1 border rounded dark:border-gray-600">1</button>
          <button className="px-2 py-1 border rounded dark:border-gray-600">2</button>
          <button className="px-2 py-1 border rounded dark:border-gray-600">3</button>
          <span>...</span>
          <button className="px-2 py-1 border rounded dark:border-gray-600">50</button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;