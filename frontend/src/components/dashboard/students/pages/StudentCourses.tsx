import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input"; // shadcn Input
import { Button } from "@/components/ui/button"; // shadcn Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // shadcn Card

const courses = [
  { id: 1, title: "Ultimate Design App Training", lesson: "1. Introduction", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg" },
  { id: 2, title: "React for Beginners", lesson: "2. JSX & Components", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg" },
  { id: 3, title: "Advanced UI/UX Principles", lesson: "3. Wireframing", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg" },
  { id: 4, title: "Full-Stack Development", lesson: "4. Backend Basics", image: "https://i.ytimg.com/vi/e_dv7GBHka8/maxresdefault.jpg" },
];

const StudentCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-gray-600">View courses assigned to you by the admin.</p>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/video/${course.id}`)}
          >
            <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-t-md" />
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{course.lesson}</p>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => navigate(`/video/${course.id}`)}
              >
                View Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;