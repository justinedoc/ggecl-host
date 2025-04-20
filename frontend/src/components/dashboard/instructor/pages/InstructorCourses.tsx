import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreVertical, ClipboardList, Calendar, Video } from "lucide-react";

const courses = [
  {
    id: 1,
    name: "Ultimate Design App Training",
    category: "Design",
    students: ["Student A", "Student B", "Student C"],
  },
  {
    id: 2,
    name: "React for Beginners",
    category: "Development",
    students: ["Student X", "Student Y"],
  },
  {
    id: 3,
    name: "Advanced UI/UX Principles",
    category: "Design",
    students: [],
  },
];

const InstructorCourses = () => {
  const handleGiveAssignment = (courseId: number) => {
    console.log(`Give assignment for course ID: ${courseId}`);
  };

  const handleSchedule = (courseId: number) => {
    console.log(`Schedule for course ID: ${courseId}`);
  };

  const handleVideoCall = (courseId: number) => {
    console.log(`Video call for course ID: ${courseId}`);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>

      <div className="mb-4">
        <Label htmlFor="search-courses">Search My Courses:</Label>
        <Input
          type="text"
          id="search-courses"
          placeholder="Search your courses..."
          className="w-full md:w-64 mt-1"
        />
      </div>

      {courses.map((course) => (
        <div key={course.id} className="mb-8 border rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
          <p className="text-gray-600 mb-2">Category: {course.category}</p>
          <p className="text-gray-600 mb-2">Students Enrolled: {course.students.length}</p>

          <h3 className="text-lg font-semibold mb-2">Enrolled Students</h3>
          {course.students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleGiveAssignment(course.id)}>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Give Assignment
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSchedule(course.id)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleVideoCall(course.id)}>
                            <Video className="mr-2 h-4 w-4" />
                            Video Call
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 mt-2">No students enrolled in this course yet.</p>
          )}
        </div>
      ))}

      {courses.length === 0 && (
        <p className="text-gray-500">No courses assigned to you.</p>
      )}
    </div>
  );
};

export default InstructorCourses;