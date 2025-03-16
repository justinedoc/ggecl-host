import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

export interface CourseType {
  course: {
    id: number;
    title: string;
    instructor: {
      name: string;
      role: string;
      image: string;
      reviews: number;
      students: number;
      courses: number;
      bio: string;
    };
    description: string;
    certification: string;
    syllabus: any[];
    reviews: {
      rating: number;
      reviewer: string;
      date: string;
      comment: string;
      image: string;
      stars: number;
    }[];
    totalRating: number;
    totalStar: number;
    duration: string;
    lectures: number;
    level: string;
    price: number;
    img: string;
    badge?: string;
  };
}

function CourseBox({ course }: CourseType) {
  const navigate = useNavigate();

  function handleNavigation(id: number) {
    navigate(`/courses/${id}`);
  }
  return (
    <Card
      className="md:max-w-[15rem] xl:max-w-[17rem] py-2 shadow-sm dark:bg-gray-900 dark:border-gray-800 cursor-pointer"
      onClick={() => handleNavigation(course.id)}
    >
      <CardHeader className="py-1 px-3 space-y-1 relative">
        {course?.badge && (
          <Badge className="absolute top-0 w-fit mb-1">{course.badge}</Badge>
        )}
        <div className="mb-1 rounded-md overflow-hidden md:h-32">
          <img
            src={course.img}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardTitle className="text-xl md:text-lg font-semibold tracking-normal text-gray-800 dark:text-white">
          {course.title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          By {course.instructor.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-0 px-3 space-y-1">
        <DisplayRating
          rating={course.totalRating}
          stars={course.totalStar}
        />
        <p className="text-sm dark:text-gray-400 text-gray-600">
          <span>{course.duration}</span> •{" "}
          <span>{course.lectures} Lectures</span> • <span>{course.level}</span>
        </p>
      </CardContent>
      <CardFooter className="py-2 px-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          ${course.price}
        </h1>
        <Button
          variant="outline"
          size="icon"
          className="border-gray-300 dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export function DisplayRating({
  maxRating = 5,
  rating,
  stars,
}: {
  rating: number;
  maxRating?: number;
  stars: number;
}) {
  return (
    <aside className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star key={i} full={i + 1 <= stars} />
        ))}
      </div>
      <span className="text-xs dark:text-gray-400 text-gray-600 font-medium">
        ({rating} Ratings)
      </span>
    </aside>
  );
}

export function Star({
  full,
  className,
}: {
  full: boolean;
  className?: string;
}) {
  return full ? (
    <StarIcon
      className={cn(
        "w-4 h-4 fill-[#FFC806] text-[#FFC806] stroke-none",
        className
      )}
    />
  ) : (
    <StarIcon
      className={cn(
        "w-4 h-4 fill-[#b1b1b1] text-[#b1b1b1] stroke-none",
        className
      )}
    />
  );
}

export default CourseBox;
