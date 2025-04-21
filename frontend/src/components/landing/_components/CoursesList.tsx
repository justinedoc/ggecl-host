import CourseBox from "./CourseBox";
import ListContainer from "../../ui/ListContainer";
import { useCourses } from "@/hooks/useCourses";

function Courses() {
  const { courses, loading } = useCourses({});

  return (
    <ListContainer
      isLoading={loading}
      header="Top courses"
      path="/courses"
      render={courses.map((course) => (
        <CourseBox key={course._id.toString()} course={course} />
      ))}
    />
  );
}

export default Courses;
