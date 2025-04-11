import CourseBox from "./CourseBox";
import ListContainer from "../../ui/ListContainer";
import { useCourses } from "../hooks/useCourses";

function Courses() {
  const { courses, loadingCourses } = useCourses({});

  return (
    <ListContainer
      isLoading={loadingCourses}
      header="Top courses"
      path="/courses"
      render={courses.map((course) => (
        <CourseBox key={course.title} course={course} />
      ))}
    />
  );
}

export default Courses;
