import InstructorBox from "./InstructorBox";
import ListContainer from "../../ui/ListContainer";
import { useInstructors } from "@/hooks/useInstructors";

function Instructors() {
  const { instructors, loading } = useInstructors({});
  return (
    <ListContainer
      isLoading={loading}
      header="Top Instructors"
      path="/instructors"
      render={instructors.map((instructor) => (
        <InstructorBox
          key={instructor._id.toString()}
          instructor={instructor}
        />
      ))}
    />
  );
}

export default Instructors;
