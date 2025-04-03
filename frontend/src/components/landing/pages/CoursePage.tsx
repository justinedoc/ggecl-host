import { FaFacebook, FaGithub, FaGoogle, FaTwitter } from "react-icons/fa";
import { tempCourseData } from "../_components/CoursesList";
import { useParams } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CourseBox, { CourseType, DisplayRating } from "../_components/CourseBox";
import { Separator } from "@/components/ui/separator";
import tempInstructorImg from "@/assets/images/temp-instructor-img.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseInfo from "../_components/CourseInfo";
import ListContainer from "@/components/ui/ListContainer";

const CoursePage = () => {
  const { id } = useParams();
  const course = tempCourseData.find((course) => course.id === Number(id));

  if (!course) return "Course not found";

  return (
    <section>
      <main className="text-gray-800 dark:text-gray-200 dark:bg-gray-900 relative">
        <div className="p-4 md:p-10 grid grid-cols-1 md:grid-cols-4 dark:bg-gray-800 bg-[#f8fafc]">
          <div className="md:col-span-3">
            <header>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/categories">
                      Categories
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-blue-500">
                      {course.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <h1 className="text-2xl md:text-4xl font-bold my-5 md:my-7">
                {course.title}
              </h1>
            </header>

            <div className="flex gap-5 flex-col">
              <p className="text-sm md:text-base w-full md:w-[70%]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
                exercitationem tempora temporibus quis! Iste, cum. Lorem ipsum
                dolor sit amet. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Iste, asperiores.
              </p>

              <div className="flex flex-col md:flex-row md:items-center md:h-[3vh] md:space-x-3">
                <DisplayRating
                  rating={course.totalRating}
                  stars={course.totalStar}
                />
                <Separator
                  orientation="vertical"
                  className="hidden md:block dark:bg-gray-600"
                />
                <p className="text-sm dark:text-gray-400 text-gray-600">
                  <span>{course.duration}</span> •{" "}
                  <span>{course.lectures} Lectures</span> •{" "}
                  <span>{course.level}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="object-cover">
                  <AvatarImage src={tempInstructorImg} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p>
                  Created by{" "}
                  <span className="text-blue-500">
                    {course.instructor.name}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <Globe />
                <span className="text-sm text-gray-500">
                  English, Spanish, Italian, German.
                </span>
              </div>
            </div>
          </div>
        </div>

        <CourseInfo course={course} />

        <CourseAction course={course} />
      </main>

      <ListContainer
        header="Similar courses"
        path="/courses"
        render={tempCourseData.map((course) => (
          <CourseBox key={course.id} course={course} />
        ))}
      />
    </section>
  );
};

function CourseAction({ course }: CourseType) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300/30 dark:border-blue-300/20 shadow-md rounded-xl p-4 md:absolute md:top-14 md:right-10 md:w-[18rem]">
      <div className="md:max-h-36 md:max-w-[17rem] overflow-hidden rounded-lg">
        <img
          src={course.img}
          className="w-full object-cover rounded-lg"
          alt={course.title}
        />
      </div>
      <div className="mt-4">
        <p className="flex items-center gap-2">
          <span className="text-2xl font-bold">
            ${(course.price * 0.5).toFixed(2)}
          </span>
          <span className="text-gray-400 line-through">${course.price}</span>
          <span className="text-green-500 font-bold">50% Off</span>
        </p>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <Button
          variant="outline"
          className="border-black font-semibold dark:border-blue-300/20 dark:bg-transparent"
        >
          Add To Cart
        </Button>
        <Button className="dark:text-gray-800">Buy Now</Button>
      </div>
      <Separator className="my-5" />
      <div className="flex gap-4 justify-center text-xl text-gray-800 dark:text-gray-400">
        <FaFacebook />
        <FaGithub />
        <FaGoogle />
        <FaTwitter />
      </div>
    </div>
  );
}

export default CoursePage;
