import { useState } from "react";

const AddCourse = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="p-6 md:p-8 text-gray-800 dark:text-gray-200">
      <p className="text-3xl md:text-4xl font-bold">Create Course</p>

      
      <div className="grid grid-cols-1 md:grid-cols-10 mt-10 md:gap-6 w-full items-start">
        <form className="py-4 px-2 flex flex-col gap-6 w-full rounded-lg col-span-7">
            {/* Course Thumbnail */}
<div className="flex flex-col gap-4 items-center md:items-start w-full md:w-80">
  <label
    className="text-gray-600 dark:text-gray-300 text-left"
    htmlFor="imageUpload"
  >
    Course Thumbnail
  </label>
  <div className="relative w-full">
    <img
      src={selectedImage || "https://via.placeholder.com/150"}
      alt="Course Thumbnail"
      className="w-full h-60 object-cover border border-gray-300 dark:border-gray-700 rounded-md"
    />
    <label
      htmlFor="imageUpload"
      className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-center text-white py-2 cursor-pointer rounded-b-md"
    >
      Click to Upload Thumbnail
    </label>
    <input
      type="file"
      id="imageUpload"
      accept="image/*"
      className="hidden"
      onChange={handleImageUpload}
    />
  </div>
  <p className="text-sm text-center md:text-left text-gray-500 dark:text-gray-400">
    Image size should be under 1MB and ratio 16:9.
  </p>
</div>
          {/* Course Title */}
          <div className="flex flex-col gap-4">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="title">
              Course Title
            </label>
            <input
              placeholder="Enter course title"
              className="input-field"
              type="text"
              id="title"
              required
            />
          </div>

          {/* Course Description */}
          <div className="flex flex-col gap-4">
            <label
              className="text-gray-600 dark:text-gray-300"
              htmlFor="description"
            >
              Course Description
            </label>
            <textarea
              placeholder="Enter a detailed course description"
              className="input-field min-h-32"
              id="description"
              required
            ></textarea>
          </div>

          {/* Course Category */}
          <div className="flex flex-col gap-4">
            <label
              className="text-gray-600 dark:text-gray-300"
              htmlFor="category"
            >
              Course Category
            </label>
            <select id="category" className="input-field" required>
              <option value="">Select a category</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="business">Business</option>
            </select>
          </div>

          {/* Course Price */}
          <div className="flex flex-col gap-4">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="price">
              Course Price (USD)
            </label>
            <input
              placeholder="Enter course price"
              className="input-field"
              type="number"
              id="price"
              min="0"
              required
            />
          </div>

          {/* Course Duration */}
          <div className="flex flex-col gap-4">
            <label
              className="text-gray-600 dark:text-gray-300"
              htmlFor="duration"
            >
              Course Duration (in hours)
            </label>
            <input
              placeholder="Enter course duration"
              className="input-field"
              type="number"
              id="duration"
              min="1"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="w-full justify-start">
            <button className="btn-primary btn">Create Course</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;