import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import userImg from "@/assets/images/user.png";

const AdminSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="p-6 md:p-8 text-gray-800 dark:text-gray-200">
      <p className="text-3xl md:text-4xl font-bold">Account Settings</p>

      <div className="grid grid-cols-1 md:grid-cols-10 mt-10 md:gap-6 items-center w-full">
       

        {/* Account Info Form */}
        <form className="p-4 flex flex-col gap-6 w-full rounded-lg col-span-7">
          <div className="flex flex-col gap-4">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="name">
              Full Name
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                placeholder="First Name"
                className="input-field"
                type="text"
                id="name"
              />
              <input
                placeholder="Last Name"
                className="input-field"
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="username">
              Username
            </label>
            <input placeholder="Username" className="input-field" type="text" id="username" />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="number">
              Phone Number
            </label>
            <input placeholder="Phone number" className="input-field" type="tel" id="number" />
          </div>

          <div className="w-full justify-start"><button className="btn-primary btn">Save Changes</button></div>
        </form>

         {/* Image Upload Section */}
         <div className="border border-gray-300 dark:border-gray-700 p-4 flex flex-col gap-4 justify-center items-center rounded-lg w-full md:w-max col-span-3 h-max md:mb-0 mb-10">
          <div className="relative">
            <img
              src={selectedImage || userImg}
              alt="User"
              className="w-36 h-36 md:w-60 md:h-60 object-cover border border-gray-300 dark:border-gray-700 rounded-md"
            />
            <label
              htmlFor="imageUpload"
              className="absolute bottom-0 bg-black bg-opacity-50 w-full text-center text-white py-2 cursor-pointer rounded-b-md"
            >
              Click to Upload
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-sm text-center w-40">
            Image size should be under 1MB and ratio 1:1.
          </p>
        </div>
      </div>

      {/* Password Change Form */}
      <form className="p-4 flex flex-col gap-6 w-full md:w-[40rem] rounded-lg mt-10">
        <p className="text-2xl font-bold">Change Password</p>

        {["Current Password", "New Password", "Confirm Password"].map((label, index) => (
          <div key={index} className="flex flex-col gap-4 relative">
            <label className="text-gray-600 dark:text-gray-300">{label}</label>
            <input
              placeholder={label}
              className="input-field pr-10"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              className="absolute right-3 top-[60%] transform -translate-y-1/2 text-gray-500 dark:text-gray-400 mt-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        ))}

        <div className="w-full justify-start"><button className="btn-primary btn">Save Password</button></div>
      </form>
    </div>
  );
};

export default AdminSettings;
