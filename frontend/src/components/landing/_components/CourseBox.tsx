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
import { useCustomNavigate } from "@/hooks/useCustomNavigate";

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
    syllabus: string[];
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
  const { navigate } = useCustomNavigate();

  function handleNavigation(id: number) {
    navigate(`/courses/${id}`);
  }

  // Replace this with your intended cart action
  function handleCartAction(e: React.MouseEvent) {
    // Prevent the card onClick from firing
    e.stopPropagation();
    console.log("Cart button clicked");
    // Perform the cart action here (e.g., add the course to cart)
  }

  return (
    <Card
      className="w-full cursor-pointer gap-1 py-2 shadow-sm xl:max-w-[17rem] dark:border-gray-800 dark:bg-gray-900"
      onClick={() => handleNavigation(course.id)}
    >
      <CardHeader className="relative px-3 py-1">
        {course?.badge && (
          <Badge className="absolute top-0 mb-1 w-fit rounded-full bg-[#111827] dark:bg-white">
            {course.badge}
          </Badge>
        )}
        <div className="mb-1 overflow-hidden rounded-md md:h-32">
          <img
            src={course.img}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
        <CardTitle className="text-xl font-semibold tracking-normal text-gray-800 md:text-lg dark:text-white">
          {course.title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          By {course.instructor.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-0">
        <DisplayRating rating={course.totalRating} stars={course.totalStar} />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span>{course.duration}</span> •{" "}
          <span>{course.lectures} Lectures</span> • <span>{course.level}</span>
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between px-3 py-1">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          ${course.price}
        </h1>
        <Button
          variant="outline"
          size="icon"
          className="border-gray-300 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          onClick={handleCartAction}
        >
          <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
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
        "h-4 w-4 fill-[#FFC806] stroke-none text-[#FFC806]",
        className,
      )}
    />
  ) : (
    <StarIcon
      className={cn(
        "h-4 w-4 fill-[#b1b1b1] stroke-none text-[#b1b1b1]",
        className,
      )}
    />
  );
}

export default CourseBox;
