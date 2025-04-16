import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudents } from "../hooks/useStudents";
import { useEnrollStudent } from "../hooks/useEnrollStudent";

// Define the registration schema with Zod validation
const StudentRegistrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  gender: z
    .enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Invalid gender selection" }),
    })
    .default("other"),
  picture: z.string().url("Invalid URL format").optional(),
});

type StudentRegistrationForm = z.infer<typeof StudentRegistrationSchema>;

const StudentInfo: React.FC = () => {
  // Local state for search, pagination, and rows per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Extract student data and loading state
  const { loadingStudents, students } = useStudents({});

  const { enrollStudent, isEnrolling } = useEnrollStudent();

  // Set up form with react-hook-form and zod schema resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentRegistrationForm>({
    resolver: zodResolver(StudentRegistrationSchema),
  });

  // Reset page to first when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handler for adding a student
  const onSubmit = (data: StudentRegistrationForm) => {
    console.log("New Student Data:", data);
    enrollStudent(data);
    setTimeout(() => {
      reset();
    }, 2000);
  };

  // Filter students by the search term (case-insensitive)
  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination details
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const currentDataStart = (currentPage - 1) * rowsPerPage;
  const paginatedStudents = filteredStudents.slice(
    currentDataStart,
    currentDataStart + rowsPerPage,
  );

  // Handlers for pagination and rows changes
  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white p-4 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-6">
        {/* Add Student Section */}
        <div className="rounded-lg border border-gray-700 bg-gray-100 p-4 shadow dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            Add Student
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-4"
          >
            {/* Full Name Field */}
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName")}
                className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            {/* Email Field */}
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Gender Field */}
            <div className="col-span-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                {...register("gender")}
                className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <button
              disabled={isEnrolling}
              type="submit"
              className="col-span-1 w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
            >
              {isEnrolling ? "Enrolling" : " Add Student"}
            </button>
          </form>
        </div>

        {/* Student List Section */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
            Student List
          </h2>
          {/* Search Field */}
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search by full name"
              className="w-full rounded-md border border-gray-300 px-4 py-2 md:w-1/3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <input type="checkbox" />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Enrolment Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900">
                {loadingStudents ? (
                  // Fallback if data is still loading
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center">
                      Loading students...
                    </td>
                  </tr>
                ) : paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <tr
                      key={student.email}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">
                        <input type="checkbox" />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {student.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {student.email}
                      </td>
                      {/* Uncomment and implement additional columns as needed */}
                      {/* <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {student.createdAt}
                      </td> */}
                      {/* <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {student.progress}
                      </td> */}
                      {/* <td className="px-4 py-3 text-sm">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[student.status]}`}>
                          {student.status}
                        </span>
                      </td> */}
                      <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                        ...
                      </td>
                    </tr>
                  ))
                ) : (
                  // Display if no students are found
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-xl font-semibold"
                    >
                      Enroll students to start managing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Show rows:
              <select
                className="ml-2 rounded-md border px-2 py-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                className={`rounded border px-2 py-1 dark:border-gray-600 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              <span>
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                className={`rounded border px-2 py-1 dark:border-gray-600 ${
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                disabled={currentPage === totalPages || totalPages === 0}
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

export default StudentInfo;
