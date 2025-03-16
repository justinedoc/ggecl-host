import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { tempCourseData } from "../_components/CoursesList";
import { DisplayRating } from "../_components/CourseBox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function Cart() {
  const totalPrice = tempCourseData.reduce(
    (acc, course) => acc + course.price,
    0
  );
  const discount = 10;
  const tax = 20;
  const finalTotal = totalPrice - discount + tax;

  return (
    <section className="px-4 py-10 md:px-8 md:py-12 w-full grid grid-cols-1 lg:grid-cols-3 dark:bg-gray-900">
      {/* Cart Section */}
      <main className="col-span-2">
        <header className="flex flex-col md:flex-row gap-2 md:gap-10 mb-7 items-baseline">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-500">
                  Shopping Cart
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="text-gray-500 dark:text-gray-400 border-b dark:border-gray-700 py-1">
          {tempCourseData.length}{" "}
          {tempCourseData.length === 1 ? "Course" : "Courses"} in Cart
        </div>

        {/* Course List */}
        <article className="space-y-6 mt-4">
          {tempCourseData.map((course) => (
            <div
              key={course.id}
              className="flex flex-col md:flex-row gap-2 md:gap-4 border p-4 rounded-md dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Course Image */}
              <div className="w-full md:w-44 md:h-24 overflow-hidden rounded-md">
                <img
                  src={course.img}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Course Details */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {course.title}
                </h2>
                <p className="my-1 text-sm text-gray-500 dark:text-gray-400">
                  By {course.instructor.name}
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
                  <p className="text-xs text-gray-600 dark:text-gray-400 space-x-2 mt-1 md:mt-0">
                    <span>{course.duration}</span>
                    <span>{course.lectures} Lectures</span>
                    <span>{course.level}</span>
                  </p>
                </div>
                <div className="flex mt-2 text-sm space-x-3 h-[3vh]">
                  <span className="text-blue-500 dark:text-blue-400 cursor-pointer">
                    Save for later
                  </span>
                  <Separator orientation="vertical" />
                  <span className="text-red-500 dark:text-red-400 cursor-pointer">
                    Remove
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-700 dark:text-white">
                  ${course.price}
                </h1>
              </div>
            </div>
          ))}
        </article>
      </main>

      {/* Order Summary */}
      <aside className="col-span-1 w-full lg:w-[20rem] mt-14 border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 h-fit md:ml-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Order Details
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Price</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Discount</span>
            <span className="text-red-500">-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator className="my-2 dark:bg-gray-600" />
          <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
        <Button className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition duration-200">
          Proceed to Checkout
        </Button>
      </aside>
    </section>
  );
}

export default Cart;
