import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import tempInstructorImg from "../../../assets/images/temp-instructor-img.png";
import { Star } from "lucide-react";

interface InstructorType {
  instructor: {
    name: string;
    category: string;
    reviews: number;
    image: string;
    students: number;
  };
}

function InstructorBox({ instructor }: InstructorType) {
  return (
    <Card className="md:max-w-[15rem] xl:max-w-[17rem]">
      <CardHeader className="py-2 items-center px-3 space-y-0">
        <div className="mb-2">
          <img src={tempInstructorImg} alt="course" />
        </div>
        <CardTitle className="text-xl md:text-lg md:font-semibold font-medium tracking-normal">
          {instructor.name}
        </CardTitle>
        <CardDescription>{instructor.category}</CardDescription>
      </CardHeader>
      <CardContent className="py-2 border-t px-3 flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <Star className="fill-[#FFC806] stroke-none" />
          <span>{instructor.reviews}</span>
        </div>

        <span className="text-[13px] font-semibold text-gray-500">
          {instructor.students} students
        </span>
      </CardContent>
    </Card>
  );
}

export default InstructorBox;
