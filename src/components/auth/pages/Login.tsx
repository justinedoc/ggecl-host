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
import { CustomLink } from "../ui/CustomLink";
import { loginStudent } from "@/api/services/students";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatZodErrors } from "@/lib/formatZodErrors";
import { AxiosError } from "axios";
import { useCustomNavigate } from "@/hooks/useCustomNavigate";
import { ErrorResType } from "@/types/errorResponseType";
import AuthContainer from "../_components/AuthContainer";
import { useAuth } from "@/contexts/AuthContext";
import { LoginResponseSchema } from "@/schemas/studentResponse";

// Define a schema for our login form data.
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { navigate } = useCustomNavigate();
  const { handleLogin } = useAuth();

  // Mutation using react-query.
  const { mutate, isPending } = useMutation({
    mutationFn: loginStudent,
    onSuccess: (data) => {
      try {
        const validatedData = LoginResponseSchema.parse(data.data);
        handleLogin(validatedData.accessToken);
        toast.success("Login successful! Welcome back");
        navigate("/student/dashboard", { replace: true });
      } catch (parseError) {
        console.error("Data validation failed:", parseError);
        toast.error("Unexpected response from server. Please try again.");
      }
    },
    onError: (error: AxiosError) => {
      const errorResponseData = error?.response?.data as ErrorResType<string>;
      if (errorResponseData?.message?.toLowerCase()?.includes("validation")) {
        toast.error(formatZodErrors(errorResponseData));
        return;
      }
      toast.error(
        errorResponseData?.message ||
          "An error occurred, please try again later"
      );
      console.error("Login error:", error.response || error);
    },
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <AuthContainer isPending={isPending}>
      <div className="flex flex-col gap-4 w-full md:mt-5 md:p-5 relative">
        <div className="w-full space-y-5">
          <FormHead title="Student Login">
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
                className="bg-gray-900 border border-blue-300/30 disabled:border-0 disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:text-white font-semibold hover:bg-gray-800 w-full"
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
          <div className="text-center space-y-3">
            <p className="text-sm">
              Don't have an account?{" "}
              <CustomLink to="/signup">Sign up</CustomLink>
            </p>

            <p className="text-xs text-center">
              By creating an account, you agree to GGECL's{" "}
              <CustomLink to="https://ggecl.com/terms.html">
                Terms of Service
              </CustomLink>
            </p>
          </div>
        </div>
      </div>

      <LoginPopup />
    </AuthContainer>
  );
};

export default Login;
