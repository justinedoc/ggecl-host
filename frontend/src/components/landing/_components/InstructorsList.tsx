import InstructorBox from "./InstructorBox";
import ListContainer from "../../ui/ListContainer";

export const tempInstructorData = [
  {
    id: 183782,
    name: "Ronald Richards",
    category: "UI/UX Designer",
    reviews: 4.8,
    image: "https://via.placeholder.com/150",
    students: 2100,
  },
  {
    id: 72620,
    name: "Ronald Richards",
    category: "UI/UX Designer",
    reviews: 4.8,
    image: "https://via.placeholder.com/150",
    students: 2100,
  },
  {
    id: 1727671,
    name: "Ronald Richards",
    category: "UI/UX Designer",
    reviews: 4.8,
    image: "https://via.placeholder.com/150",
    students: 2100,
  },
  {
    id: 268182,
    name: "Ronald Richards",
    category: "UI/UX Designer",
    reviews: 4.8,
    image: "https://via.placeholder.com/150",
    students: 2100,
  },
];

function Instructors() {
  return (
    <ListContainer
      header="Top Instructors"
      path="/instructors"
      render={tempInstructorData.map((instructor) => (
        <InstructorBox key={instructor.id} instructor={instructor} />
      ))}
    />
  );
}

export default Instructors;
