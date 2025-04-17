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
import { FaSearch } from "react-icons/fa";
import MarkAssignmentModal from "@/components/ui/MarkAssignmentModal"; // Import the new modal

export interface Assignment {
  title: string;
  course: string;
  dueDate: string;
  status: string;
  pdfUrl?: string;
  _id?: string;
  grade?: "A" | "B" | "C" | "D" | null;
}

const initialAssignments: Assignment[] = [
  {
    _id: "admin1",
    title: "Math Homework",
    course: "Algebra",
    dueDate: "2025-03-05",
    status: "Pending",
    pdfUrl: "/path/to/math_homework.pdf",
  },
  {
    _id: "admin2",
    title: "Science Project",
    course: "Physics",
    dueDate: "2025-03-10",
    status: "Completed",
    pdfUrl: "/path/to/science_project.pdf",
    grade: "B",
  },
  // ... other assignments
];

export default function AssignmentAd() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // State for creating new assignments
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentCourse, setNewAssignmentCourse] = useState("");
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState("");

  const filteredAssignments = assignments
    .filter((a) => (filterStatus === "All" ? true : a.status === filterStatus))
    .filter((a) => (filterDate ? a.dueDate === filterDate : true));

  const totalPages = Math.ceil(filteredAssignments.length / rowsPerPage);
  const paginatedData = filteredAssignments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const openMarkModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsMarkModalOpen(true);
  };

  const closeMarkModal = () => {
    setIsMarkModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleGradeSubmitted = (assignmentId: string, grade: "A" | "B" | "C" | "D" | null) => {
    const updatedAssignments = assignments.map((a) =>
      a._id === assignmentId ? { ...a, status: "Marked", grade } : a
    );
    setAssignments(updatedAssignments);
  };

  const handleCreateNewAssignment = () => {
    if (newAssignmentTitle && newAssignmentCourse && newAssignmentDueDate) {
      const newAssignment: Assignment = {
        _id: `new-${Date.now()}`,
        title: newAssignmentTitle,
        course: newAssignmentCourse,
        dueDate: newAssignmentDueDate,
        status: "Pending",
      };
      setAssignments([...assignments, newAssignment]);
      setNewAssignmentTitle("");
      setNewAssignmentCourse("");
      setNewAssignmentDueDate("");
    } else {
      alert("Please fill in all the fields for the new assignment.");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header and Filters */}
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
            <option className="dark:bg-gray-900 bg-gray-100 outline-none" value="All">
              All Status
            </option>
            <option className="dark:bg-gray-900 bg-gray-100 outline-none" value="Pending">
              Pending
            </option>
            <option className="dark:bg-gray-900 bg-gray-100 outline-none" value="Completed">
              Completed
            </option>
            <option className="dark:bg-gray-900 bg-gray-100 outline-none" value="In Progress">
              In Progress
            </option>
            <option className="dark:bg-gray-900 bg-gray-100 outline-none" value="Marked">
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

      {/* Assignment Table */}
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
              Grade
            </TableHead>
            <TableHead className="font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((assignment) => (
            <TableRow key={assignment._id} className="border mt-20 mb-20 rounded-lg ">
              <TableCell className="whitespace-nowrap">{assignment.title}</TableCell>
              <TableCell className="whitespace-nowrap">{assignment.course}</TableCell>
              <TableCell className="whitespace-nowrap">{assignment.dueDate}</TableCell>
              <TableCell className="whitespace-nowrap">{assignment.status}</TableCell>
              <TableCell className="whitespace-nowrap">{assignment.grade || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">
                {(assignment.status === "Pending" || assignment.status === "In Progress") && (
                  <button
                    onClick={() => openMarkModal(assignment)}
                    className="bg-blue-600 text-md text-white px-3 py-1 rounded-md"
                  >
                    Mark
                  </button>
                )}
                {assignment.status === "Marked" && "Marked"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total Assignments: {filteredAssignments.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        {/* ... pagination controls ... */}
      </div>

      {/* Mark Assignment Modal */}
      {selectedAssignment && (
        <MarkAssignmentModal
          assignment={selectedAssignment}
          isOpen={isMarkModalOpen}
          onClose={closeMarkModal}
          onGradeSubmitted={handleGradeSubmitted}
        />
      )}

      {/* Create New Assignment Form */}
      <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Create New Assignment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="newTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title:</label>
            <input
              type="text"
              id="newTitle"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 p-2 ring-blue-700 dark:border-gray-600 dark:text-gray-200"
              value={newAssignmentTitle}
              onChange={(e) => setNewAssignmentTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="newCourse" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course:</label>
            <input
              type="text"
              id="newCourse"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 p-2 ring-blue-700 dark:border-gray-600 dark:text-gray-200"
              value={newAssignmentCourse}
              onChange={(e) => setNewAssignmentCourse(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="newDueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date:</label>
            <input
              type="date"
              id="newDueDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 p-2 ring-blue-700 dark:border-gray-600 dark:text-gray-200"
              value={newAssignmentDueDate}
              onChange={(e) => setNewAssignmentDueDate(e.target.value)}
            />
          </div>
        </div>
        <button onClick={handleCreateNewAssignment} className="bg-blue-700 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600">
          Create Assignment
        </button>
      </div>
    </div>
  );
}