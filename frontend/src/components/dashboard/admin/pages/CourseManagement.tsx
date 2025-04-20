import { useState } from "react";
import { MoreVertical, Edit, Trash, Plus, UserPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router";

const courses = [
  {
    id: 1,
    name: "Ultimate Design App Training",
    instructor: "John Doe",
    students: 25,
    category: "Design",
    price: "$89.00",
  },
  {
    id: 2,
    name: "React for Beginners",
    instructor: "Jane Smith",
    students: 40,
    category: "Development",
    price: "$99.00",
  },
  {
    id: 3,
    name: "Advanced UI/UX Principles",
    instructor: "Alice Johnson",
    students: 30,
    category: "Design",
    price: "$79.00",
  },
];

const studentsList = ["Student A", "Student B", "Student C", "Student D", "Student E"];

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCourse = (courseId: number) => {
    console.log(`Course with ID ${courseId} deleted`);
  };

  const handleEnrollStudents = (course: any) => {
    setSelectedCourse(course);
    setSelectedStudents([]); // Reset selected students
    setIsModalOpen(true);
  };

  const handleSaveEnrollment = () => {
    if (selectedCourse) {
      selectedCourse.students = selectedStudents.length; // Update the student count
      console.log(`Enrolled students: ${selectedStudents}`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <Link
            to="/admin/dashboard/add-course"
            className="flex flexrow gap-2 items-center justify-between dark:bg-white p-2 dark:text-gray-800 rounded-md bg-gray-800 text-gray-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Link>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.instructor}</TableCell>
              <TableCell>{course.students}</TableCell>
              <TableCell>{course.category}</TableCell>
              <TableCell>{course.price}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin/dashboard/edit-course/"
                        className="flex flexrow items-center px-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="ml-2">Edit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteCourse(course.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEnrollStudents(course)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Enroll Students
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Enrolling Students */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Students</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="font-semibold">Select Students</h3>
            {studentsList.map((student) => (
              <div key={student} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedStudents.includes(student)}
                  onCheckedChange={(checked) =>
                    setSelectedStudents((prev) =>
                      checked ? [...prev, student] : prev.filter((s) => s !== student)
                    )
                  }
                />
                <span>{student}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEnrollment}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagement;