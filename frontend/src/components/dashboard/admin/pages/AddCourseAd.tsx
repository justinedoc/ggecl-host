import { useState } from "react";

const AddCourseAd = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
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

          {/* Course Video */}
          <div className="flex flex-col gap-4">
            <label
              className="text-gray-600 dark:text-gray-300"
              htmlFor="videoUpload"
            >
              Course Video
            </label>
            <input
              type="file"
              id="videoUpload"
              accept="video/*"
              className="input-field"
              onChange={handleVideoUpload}
            />
            {selectedVideo && (
              <video
                controls
                src={selectedVideo}
                className="w-full h-60 object-cover border border-gray-300 dark:border-gray-700 rounded-md"
              />
            )}
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

          {/* Instructor */}
          <div className="flex flex-col gap-4">
            <label
              className="text-gray-600 dark:text-gray-300"
              htmlFor="instructor"
            >
              Instructor ID
            </label>
            <input
              placeholder="Enter instructor ID"
              className="input-field"
              type="text"
              id="instructor"
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

          {/* Certification */}
          <div className="flex flex-col gap-4">
            <label
              className="text-gray-600 dark:text-gray-300"
              htmlFor="certification"
            >
              Certification
            </label>
            <input
              placeholder="Enter certification type (e.g., Normal, Advanced)"
              className="input-field"
              type="text"
              id="certification"
            />
          </div>

          {/* Syllabus */}
          <div className="flex flex-col gap-4">
            <label
              className="text-gray-600 dark:text-gray-300"
              htmlFor="syllabus"
            >
              Syllabus (comma-separated)
            </label>
            <textarea
              placeholder="Enter syllabus topics separated by commas"
              className="input-field min-h-32"
              id="syllabus"
            ></textarea>
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
              type="text"
              id="duration"
              required
            />
          </div>

          {/* Number of Lectures */}
          <div className="flex flex-col gap-4">
            <label
              className="text-gray-600 dark:text-gray-300"
              htmlFor="lectures"
            >
              Number of Lectures
            </label>
            <input
              placeholder="Enter number of lectures"
              className="input-field"
              type="number"
              id="lectures"
              min="1"
              required
            />
          </div>

          {/* Course Level */}
          <div className="flex flex-col gap-4">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="level">
              Course Level
            </label>
            <select id="level" className="input-field" required>
              <option value="">Select a level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
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

          {/* Badge */}
          <div className="flex flex-col gap-4">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="badge">
              Badge (Optional)
            </label>
            <input
              placeholder="Enter badge (e.g., Bestseller)"
              className="input-field"
              type="text"
              id="badge"
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

export default AddCourseAd;