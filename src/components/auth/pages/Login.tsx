import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoginPopup from "@/components/ui/LoginPopup";
import AuthDivider from "../ui/AuthDivider";
import { FormHead } from "../ui/FormHead";
import GoogleSigninBtn from "../ui/GoogleSigninBtn";
import logoForSignUp from "@/assets/images/logoforsignup.png";
import { CustomLink } from "../ui/CustomLink";

// Define a schema for our form data.
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Form submitted:", data);
    // Add your login logic here.
  };

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden dark:bg-gray-900">
      {/* Background Decorations */}
      <div className="absolute top-10 left-20 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-green-400/20 rounded-full blur-2xl" />

      <div className="flex flex-col justify-center items-center p-6 z-10 mt-8">
        <div className="w-full max-w-md space-y-5">
          <FormHead title="Login Student">
            Login to your student account to start learning
          </FormHead>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <Input
                          placeholder="joshdickon@gmail.com"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-base-content/40" />
                          ) : (
                            <Eye className="w-5 h-5 text-base-content/40" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#184471]" />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link to="/forgot-password" className="underline text-sm">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="mt-4 py-2 rounded-md flex gap-2 items-center w-full justify-center"
              >
                <span>Login</span>
                <FaArrowRight />
              </Button>
            </form>
          </Form>

          <AuthDivider />

          {/* Google Login */}
          <div className="w-full">
            <GoogleSigninBtn>Continue with Google</GoogleSigninBtn>
          </div>

          {/* Signup Link */}
          <div className="text-center mt-4">
            <p className="text-sm">
              Don't already have an account?{" "}
              <CustomLink to="/signup">sign up</CustomLink>
            </p>
          </div>
        </div>
      </div>

      <Link to="/" className="h-screen max-w-7xl md:block hidden">
        <img src={logoForSignUp} alt="Logo" />
      </Link>

      <LoginPopup />
    </div>
  );
};

export default Login;
