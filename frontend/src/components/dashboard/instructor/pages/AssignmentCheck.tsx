import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaSearch } from "react-icons/fa";

const assignments = [
  {
    title: "Math Homework",
    course: "Algebra",
    dueDate: "2025-03-05",
    status: "Pending",
  },
  {
    title: "Science Project",
    course: "Physics",
    dueDate: "2025-03-10",
    status: "Completed",
  },
  {
    title: "History Essay",
    course: "History",
    dueDate: "2025-03-15",
    status: "Pending",
  },
  {
    title: "Chemistry Lab",
    course: "Chemistry",
    dueDate: "2025-03-20",
    status: "Completed",
  },
  {
    title: "Literature Review",
    course: "English",
    dueDate: "2025-03-25",
    status: "Pending",
  },
  {
    title: "Python Review",
    course: "Comp Sci",
    dueDate: "2025-05-03",
    status: "In Progress",
  },
];

export default function AssignmentCheck() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAssignments = assignments
    .filter((a) => (filterStatus === "All" ? true : a.status === filterStatus))
    .filter((a) => (filterDate ? a.dueDate === filterDate : true));

  const totalPages = Math.ceil(filteredAssignments.length / rowsPerPage);
  const paginatedData = filteredAssignments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const markAssignment = (index: number) => {
    assignments[index].status = "Marked";
    setCurrentPage(currentPage); // Trigger re-render
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="md:grid grid-cols-1 md:grid-cols-2 flex flex-col justify-between items-start md:items-center mb-6 px-4">
        <div>
          <h1 className="text-4xl font-bold mb-5">Assignments to Mark</h1>
          <p>View and mark submitted assignments</p>
        </div>
        <div className="flex gap-4 items-center justify-start md:flex-row flex-row-reverse md:justify-end">
          <FaSearch className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-[2rem] text-gray-700 dark:text-gray-300" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-transparent outline-none border-none shadow-none"
          >
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value="All"
            >
              All Status
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value="Pending"
            >
              Pending
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value="Completed"
            >
              Completed
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value="In Progress"
            >
              In Progress
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value="Marked"
            >
              Marked
            </option>
          </select>
          {/* Filter by Date */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 bg-transparent outline-none"
          />
        </div>
      </div>

      <Table>
        <TableHeader className="border bg-gray-50 dark:bg-secondary rounded-lg">
          <TableRow>
            <TableHead className="font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              Assignment Title
            </TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              Course/Lesson
            </TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              Due Date
            </TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              Status
            </TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((assignment, index) => (
            <TableRow key={index} className="border mt-20 mb-20 rounded-lg ">
              <TableCell className="whitespace-nowrap">
                {assignment.title}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {assignment.course}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {assignment.dueDate}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {assignment.status}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {assignment.status === "Pending" || assignment.status === "In Progress" ? (
                  <button
                    onClick={() => markAssignment(index)}
                    className="bg-blue-600 text-md text-white px-3 py-1 rounded-md"
                  >
                    Mark
                  </button>
                ) : (
                  "Marked"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              Total Assignments: {filteredAssignments.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="mr-2">Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border rounded-lg p-2 bg-transparent outline-none border-none shadow-none"
          >
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value={3}
            >
              3
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value={5}
            >
              5
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value={10}
            >
              10
            </option>
          </select>
          <span className="ml-2">rows</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded-md disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1 ? "bg-gray-300 dark:bg-gray-800" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 border rounded-md disabled:opacity-50 "
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}