interface CategoriesType {
  category: {
    course: string;
    volume: number;
    img: JSX.Element;
  };
}

function CategoryBox({ category }: CategoriesType) {
  return (
    <div className="p-5 flex gap-2 flex-col justify-center items-center border border-blue-300/20 shadow-md md:max-w-[17rem] w-[18rem] rounded-lg hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer">
      <div className="size-20 rounded-full bg-blue-300 inline-flex justify-center items-center">
        {category.img}
      </div>

      <h2 className="text-lg font-semibold">{category.course}</h2>

      <p className="text-md font-light text-gray-800 dark:text-gray-200">
        {category.volume} Courses
      </p>
    </div>
  );
}

export default CategoryBox;
