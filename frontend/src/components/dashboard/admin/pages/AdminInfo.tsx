import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type StatusType = "Pending" | "Active" | "Completed" | "Inactive" | "Withdrawn";

interface Admin {
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

const data: Admin[] = [
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
    progress: "0%",
    status: "Pending",
  },
  // ...other Admins
];

const AdminRegistrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  gender: z
    .enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Invalid gender selection" }),
    })
    .default("other"),
  picture: z.string().url("Invalid URL format").optional(),
});

type AdminRegistrationForm = z.infer<typeof AdminRegistrationSchema>;

const AdminInfo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminRegistrationForm>({
    resolver: zodResolver(AdminRegistrationSchema),
  });

  const onSubmit = (data: AdminRegistrationForm) => {
    console.log("New Admin Data:", data);
    reset();
  };

  const filteredData: Admin[] = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 gap-6">
        {/* Add Admin Section */}
        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Add Admin</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Full Name</label>
              <input
                type="text"
                {...register("fullName")}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Gender</label>
              <select
                {...register("gender")}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition col-span-1"
            >
              Add Admin
            </button>
          </form>
        </div>

        {/* Admin Display Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Admin List</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <input type="checkbox" />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Admin Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Enrolment Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {paginatedData.map((admin) => (
                  <tr key={admin.email} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-3">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{admin.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{admin.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{admin.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{admin.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{admin.progress}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[admin.status]}`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Show rows:
              <select
                className="ml-2 border rounded-md px-2 py-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <button
                onClick={() => handlePageChange("prev")}
                className={`px-2 py-1 border rounded dark:border-gray-600 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                className={`px-2 py-1 border rounded dark:border-gray-600 ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;