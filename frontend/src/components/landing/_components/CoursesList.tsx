import CourseBox from "./CourseBox";
import ListContainer from "../../ui/ListContainer";
import courseImg1 from "@/assets/images/temp-course-img.png";
import courseImg2 from "@/assets/images/course-cart-img.png";

export const tempCourseData = [
  {
    id: 1675818,
    title: "Beginner’s Guide to Design",
    instructor: {
      name: "Ronald Richards",
      role: "Design Instructor",
      image: courseImg1,
      reviews: 1200,
      students: 3500,
      courses: 12,
      bio: "Ronald has over a decade of experience in design and has worked with top brands.",
    },
    description:
      "This interactive e-learning course introduces you to design fundamentals and best practices. Gain a solid foundation in design principles and learn to apply them in real-world scenarios through engaging modules and interactive exercises.",
    certification:
      "Upon successful completion, you'll earn a prestigious certification that validates your skills and expertise, opening up new opportunities in your design career.",
    syllabus: [], // populate with your syllabus data
    reviews: [{
      rating: 5,
      reviewer: "Alice Johnson",
      date: "2025-02-14",
      comment: "An excellent introductory course to design principles!",
      image: courseImg1,
      stars: 5,
    }],
    totalRating: 3.9,
    totalStar: 4,
    duration: "22 Total Hours",
    lectures: 155,
    level: "Beginner",
    price: 149.67,
    img: courseImg1,
    badge: "Live",
  },
  {
    id: 1727618,
    title: "Beginner’s Guide to Design",
    instructor: {
      name: "Ronald Richards",
      role: "Design Instructor",
      image: courseImg2,
      reviews: 1200,
      students: 3500,
      courses: 12,
      bio: "Ronald has over a decade of experience in design and has worked with top brands.",
    },
    description:
      "Dive deeper into design thinking and user-centered design principles. This course covers layout, typography, color theory, and practical exercises to help you create compelling and user-friendly designs.",
    certification:
      "Showcase your achievement with a recognized certification upon completion. This credential highlights your proficiency and dedication to design excellence.",
    syllabus: [],
    reviews: [{
      rating: 4,
      reviewer: "Bob Smith",
      date: "2025-02-13",
      comment: "Great course with clear explanations and practical examples.",
      image: courseImg2,
      stars: 4,
    }],
    totalRating: 3,
    totalStar: 3,
    duration: "22 Total Hours",
    lectures: 155,
    level: "Beginner",
    price: 149.67,
    img: courseImg2,
  },
  {
    id: 2930783,
    title: "Beginner’s Guide to Design",
    instructor: {
      name: "Ronald Richards",
      role: "Design Instructor",
      image: courseImg1,
      reviews: 1200,
      students: 3500,
      courses: 12,
      bio: "Ronald has over a decade of experience in design and has worked with top brands.",
    },
    description:
      "Learn core design concepts and how to effectively apply them to various projects. You’ll explore design tools, prototyping methods, and real-world case studies.",
    certification:
      "After finishing all modules, you'll receive a certification confirming your newly acquired design knowledge, helping you stand out to employers.",
    syllabus: [],
    reviews: [{
      rating: 4.5,
      reviewer: "Charlie Brown",
      date: "2025-02-12",
      comment: "Very insightful, though some topics could use more depth.",
      image: courseImg1,
      stars: 4.5,
    }],
    totalRating: 4.9,
    totalStar: 5,
    duration: "22 Total Hours",
    lectures: 155,
    level: "Beginner",
    price: 149.67,
    img: courseImg1,
  },
  {
    id: 2772781,
    title: "Beginner’s Guide to Design",
    instructor: {
      name: "Ronald Richards",
      role: "Design Instructor",
      image: courseImg2,
      reviews: 100,
      students: 3500,
      courses: 12,
      bio: "Ronald has over a decade of experience in design and has worked with top brands.",
    },
    description:
      "Perfect for newcomers, this course lays the groundwork for understanding design essentials. From wireframing to final mockups, you'll learn the entire design process.",
    certification:
      "Complete all lessons and projects to earn a course completion certificate that highlights your foundational design expertise.",
    syllabus: [],
    reviews: [{
      rating: 1,
      reviewer: "Daisy Ridley",
      date: "2025-02-11",
      comment: "I did not find the course helpful.",
      image: courseImg2,
      stars: 1,
    }],
    totalRating: 3.9,
    totalStar: 4,
    duration: "22 Total Hours",
    lectures: 155,
    level: "Beginner",
    price: 149.67,
    img: courseImg2,
  },
];

function Courses() {
  return (
    <ListContainer
      header="Top courses"
      path="/courses"
      render={tempCourseData.map((course) => (
        <CourseBox key={course.id} course={course} />
      ))}
    />
  );
}

export default Courses;
