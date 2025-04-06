import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon, ShoppingCart, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomNavigate } from "@/hooks/useCustomNavigate";
import { useMutation } from "@tanstack/react-query";
import { queryClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useTransition } from "react";

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
  const [isPendingTransition, startTransition] = useTransition();

  const { mutate: addItemMutate, isPending: isAdding } = useMutation(
    trpc.cart.addItem.mutationOptions({
      onSuccess: () => {
        toast.success(`"${course.title}" added to cart!`);
        queryClient.invalidateQueries({
          queryKey: trpc.cart.getAllItems.queryKey(),
        });
      },

      onError: (error) => {
        toast.error(error.message || "Failed to add course to cart.");
        console.error("Add to cart error:", error);
      },
    }),
  );

  const handleNavigateToCourse = () => {
    // Assuming navigation takes the string _id
    navigate(`/courses/${course.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    startTransition(() => {
      addItemMutate({ courseId: course.id as unknown as string }); // TODO: Fix type casting
    });
  };

  const isProcessing = isAdding || isPendingTransition;

  return (
    <Card
      className="flex w-full cursor-pointer flex-col shadow-sm xl:max-w-[17rem] dark:border-gray-800 dark:bg-gray-900"
      onClick={handleNavigateToCourse}
      role="link" // Better semantics
      aria-label={`View details for ${course.title}`}
    >
      <CardHeader className="relative flex-shrink-0 px-3 pt-2 pb-1">
        {course.badge && (
          <Badge className="absolute top-2 left-2 z-10 w-fit rounded-sm bg-black px-2 py-0.5 text-xs text-white dark:bg-white dark:text-black">
            {course.badge}
          </Badge>
        )}
        <div className="mb-2 aspect-video overflow-hidden rounded-md">
          {" "}
          {/* Maintain aspect ratio */}
          <img
            src={course.img}
            alt={course.title} // Alt text should be descriptive
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" // Example hover effect (add group class to Card)
            loading="lazy" // Lazy load images below the fold
          />
        </div>
        <CardTitle className="line-clamp-2 text-lg font-semibold tracking-tight text-gray-800 dark:text-white">
          {" "}
          {/* Use line-clamp */}
          {course.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          By {course.instructor.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow px-3 py-1">
        {" "}
        {/* Allow content to grow */}
        {/* DisplayRating expects rating and stars */}
        <DisplayRating rating={course.totalRating} stars={course.totalStar} />
        <p className="mt-1 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
          <span>{course.duration}</span> &bull; {/* Use HTML entity */}
          <span>{course.lectures} Lectures</span> &bull;{" "}
          <span>{course.level}</span>
        </p>
      </CardContent>
      <CardFooter className="flex-shrink-0 items-center justify-between px-3 pt-1 pb-3">
        <span className="text-lg font-bold text-gray-800 dark:text-white">
          ${course.price.toFixed(2)} {/* Ensure formatting */}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-gray-300 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          onClick={handleAddToCart}
          disabled={isProcessing}
          aria-label={`Add ${course.title} to cart`}
        >
          {isProcessing ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
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
