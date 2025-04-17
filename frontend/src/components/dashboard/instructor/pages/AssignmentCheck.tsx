import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback } from "react";
import { Assignment } from "@/utils/trpc";
import { format } from "date-fns";
import { toast } from "sonner";
import { FaSearch } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useAssignments } from "../hooks/useAssignments";
import { useInstructor } from "@/hooks/useInstructor";
import { useCreateAssignment } from "../hooks/useCreateAssignment";
import { useGradeAssignment } from "../hooks/useGradeAssignment";
import MarkAssignmentModal, {
  Grade,
} from "@/components/ui/MarkAssignmentModal";

export default function AssignmentDashboard() {
  // Data hooks
  const { assignments = [] } = useAssignments();
  const { instructor } = useInstructor();
  const { createAssignment, isCreatingAssignment } = useCreateAssignment();
  const { isGradingStudent, gradeStudent } = useGradeAssignment();

  // Filters & pagination
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const courses = instructor.courses as {
    _id: string;
    title: string;
  }[];

  const filtered = useMemo(() => {
    return assignments
      .filter((a) =>
        statusFilter === "All" ? true : a.status === statusFilter,
      )
      .filter((a) =>
        dateFilter
          ? format(new Date(a.dueDate), "yyyy-MM-dd") === dateFilter
          : true,
      )
      .filter((a) =>
        searchTerm
          ? a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.course.title.toLowerCase().includes(searchTerm.toLowerCase())
          : true,
      );
  }, [assignments, statusFilter, dateFilter, searchTerm]);

  const totalPages = useMemo(
    () => Math.ceil(filtered.length / rowsPerPage) || 1,
    [filtered, rowsPerPage],
  );

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage, rowsPerPage]);

  // Modal state
  const [selected, setSelected] = useState<Assignment | null>(null);
  const openModal = useCallback(
    (assignment: Assignment) => setSelected(assignment),
    [],
  );
  const closeModal = useCallback(() => setSelected(null), []);

  const handleGrade = (id: string, grade: Grade, remark: string) => {
    gradeStudent({
      assignmentId: id,
      grade: grade!,
      ...(remark && { remark }),
    });
    toast.success("Assignment graded successfully");
    closeModal();
  };

  // New assignment state
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCourse, setNewCourse] = useState<string>(
    instructor.courses[0]?._id.toString() || "",
  );
  const [newDueDate, setNewDueDate] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<string>("");

  const handleCreate = () => {
    if (!newTitle || !newCourse || !newDueDate || !newQuestion) {
      toast.info("All fields are required");
      return;
    }
    createAssignment(
      {
        title: newTitle,
        course: newCourse,
        dueDate: new Date(newDueDate),
        question: newQuestion,
      },
      {
        onSuccess: () => {
          toast.success("Assignment created");
          setNewTitle("");
          setNewDueDate("");
          setNewQuestion("");
        },
      },
    );
  };

  return (
    <div className="container mx-auto rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      {/* Header & Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Assignments to Mark</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View, search, and grade submitted assignments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Pending", "In Progress", "Completed", "Marked"].map(
                (s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {["Title", "Course", "Due Date", "Status", "Grade", "Action"].map(
              (h) => (
                <TableHead key={h}>{h}</TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.map((a) => (
            <TableRow key={a._id.toString()}>
              <TableCell>{a.title}</TableCell>
              <TableCell>{a.course.title}</TableCell>
              <TableCell>{format(new Date(a.dueDate), "dd-MM-yyyy")}</TableCell>
              <TableCell>{a.status}</TableCell>
              <TableCell>{a.grade ?? "-"}</TableCell>
              <TableCell>
                {a.status !== "graded" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(a)}
                  >
                    Mark
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" disabled>
                    Graded
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total: {filtered.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(v) => setRowsPerPage(Number(v))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20].map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Create Assignment */}
      <div className="mt-8 rounded-lg bg-gray-50 p-6 shadow dark:bg-gray-700">
        <h2 className="mb-4 text-2xl font-semibold">Create New Assignment</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="new-title">Title</Label>
            <Input
              id="new-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Assignment title"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label htmlFor="new-course">Course</Label>
            <Select value={newCourse} onValueChange={setNewCourse}>
              <SelectTrigger id="new-course">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c._id.toString()} value={c._id.toString()}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1">
            <Label htmlFor="new-due-date">Due Date</Label>
            <Input
              id="new-due-date"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1 md:col-span-3">
            <Label htmlFor="new-question">Question</Label>
            <Textarea
              id="new-question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter assignment question"
              rows={4}
            />
          </div>
        </div>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={handleCreate}
          disabled={isCreatingAssignment}
        >
          {isCreatingAssignment ? "Creating..." : "Create Assignment"}
        </Button>
      </div>

      {/* Grading Modal */}
      {selected && (
        <MarkAssignmentModal
          assignment={selected}
          isOpen={Boolean(selected)}
          onClose={closeModal}
          onGradeSubmitted={handleGrade}
          isGrading={isGradingStudent}
        />
      )}
    </div>
  );
}
