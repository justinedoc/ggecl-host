import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import LoginPopup from "@/components/ui/LoginPopup.tsx";
import AuthDivider from "../ui/AuthDivider";
import { FormHead } from "../ui/FormHead";
import GoogleSigninBtn from "../ui/GoogleSigninBtn";
import logoForSignUp from "@/assets/images/logoforsignup.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden dark:bg-gray-900">
      <div className="absolute top-10 left-20 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-green-400/20 rounded-full blur-2xl"></div>

      <div className="flex flex-col justify-center items-center p-6 sm:p- z-10 mt-8">
        <div className="w-full max-w-md space-y-5">
          <FormHead title="Login Student">
            Login to your student account to start learning
          </FormHead>

          <form className="space-y-5">
            {/* Email Input */}
            <div className="form-control">
              <label htmlFor="email" className="label mb-2">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative  mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 size-5" />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 py-2 rounded-md dark:bg-gray-800 outline-none shadow-sm border border-blue-300/30"
                  placeholder="joshdickon@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  id="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label htmlFor="password" className="label mb-2">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 size-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 py-2 rounded-md dark:bg-gray-800 outline-none shadow-sm border border-blue-300/30"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  id="password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#184471]" />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link to="/forgot-password" className="underline text-sm w-fit">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-4 py-2 rounded-md text-white flex gap-2 items-center w-full justify-center"
            >
              <span>Login</span> <FaArrowRight />
            </button>
          </form>

          <AuthDivider />
          {/* Google Login */}
          <div className="w-full">
            <GoogleSigninBtn>Continue with Google</GoogleSigninBtn>
          </div>

          {/* Signup Link */}
          <div className="text-center mt-4">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/signup" className="underline underline-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Link to="/" className="h-screen max-w-7xl md:block hidden">
        <img src={logoForSignUp} alt="" />
      </Link>

      {/* <div className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden dark:bg-gray-900"> */}
      <LoginPopup />
      {/* </div> */}
    </div>
  );
};

export default Login;
