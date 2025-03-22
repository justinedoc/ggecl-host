import { useState } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { cn } from "@/lib/utils";

import { CustomLink } from "../ui/CustomLink";
import { FormHead } from "../ui/FormHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthDivider from "../ui/AuthDivider";
import GoogleSigninBtn from "../ui/GoogleSigninBtn";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function SignupForm({
  onNext,
}: {
  onNext: (data: FieldValues) => void;
}): JSX.Element {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const form = useFormContext();
  const errors = form.formState.errors;

  // Check password requirements
  function handleCheckPassword(password: string) {
    return [
      { message: "One lowercase letter", isChecked: /[a-z]/.test(password) },
      { message: "One uppercase letter", isChecked: /[A-Z]/.test(password) },
      { message: "One number", isChecked: /[0-9]/.test(password) },
      {
        message: "One special character",
        isChecked: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
      { message: "6 or more characters", isChecked: password.length >= 6 },
    ];
  }

  const password: string = form.watch("password") || "";
  const email: string = form.watch("email") || "";
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <>
      <form className="flex flex-col gap-4 w-full md:mt-5 md:p-5 relative space-y-4">
        <FormHead title="Create an account">
          Start your student journey with us Today!
        </FormHead>

        <div className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-md font-semibold">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className={cn(
                        "bg-transparent w-full pl-2 py-6 md:py-5 rounded-sm focus:ring-2 focus:ring-blue-300/30 outline-none shadow-sm border border-blue-300/30",
                        { "border-red-500": errors.email }
                      )}
                    />
                    <aside className="absolute top-1/2 right-2 transform -translate-y-1/2">
                      {errors.email && !isEmailValid ? (
                        <FaXmark className="text-red-500" size={22} />
                      ) : (
                        email &&
                        isEmailValid && (
                          <FaCheckCircle className="text-green-500" size={22} />
                        )
                      )}
                    </aside>
                  </div>
                </FormControl>
                <FormMessage>
                  {errors.email && (errors.email.message as string)}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-md font-semibold">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={isPasswordHidden ? "password" : "text"}
                      placeholder="Enter your password"
                      className={cn(
                        "bg-transparent w-full pl-2 py-6 md:py-5 rounded-sm focus:ring-2 focus:ring-blue-300/30 outline-none shadow-sm border border-blue-300/30",
                        { "border-red-500": errors.password }
                      )}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center gap-1"
                      onClick={() => setIsPasswordHidden((prev) => !prev)}
                    >
                      {isPasswordHidden ? (
                        <IoEye className="w-5 h-5" />
                      ) : (
                        <IoEyeOff className="w-5 h-5" />
                      )}
                      <span className="text-sm">
                        {isPasswordHidden ? "Show" : "Hide"}
                      </span>
                    </button>
                  </div>
                </FormControl>
                <FormMessage>
                  {errors.password && (errors.password.message as string)}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Password Requirements */}
          {password && (
            <PasswordChecks password={password} checks={handleCheckPassword} />
          )}
        </div>

        <Button
          type="button"
          onClick={onNext}
          disabled={form.formState.isSubmitting}
          className="bg-gray-900 border border-blue-300/30 disabled:border-0 disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:text-white font-semibold hover:bg-gray-800"
        >
          {form.formState.isSubmitting ? "Processing..." : "Proceed"}
        </Button>

        <AuthDivider />

        <GoogleSigninBtn>Continue with Google</GoogleSigninBtn>

        <div className="text-center space-y-3">
          <p className="text-sm">
            Already have an account? <CustomLink to="/login">login</CustomLink>
          </p>
          <p className="text-xs">
            By creating an account, you agree to GGECL's{" "}
            <CustomLink to="https://ggecl.com/terms.html">
              Terms of Service
            </CustomLink>
          </p>
        </div>
      </form>
    </>
  );
}

interface PasswordType {
  message: string;
  isChecked: boolean;
}

interface PasswordChecksType {
  password: string;
  checks: (password: string) => PasswordType[];
}

function PasswordChecks({ password, checks }: PasswordChecksType): JSX.Element {
  return (
    <div className="space-y-2 mt-4">
      {checks(password).map(({ message, isChecked }) => (
        <div
          key={message}
          className={cn(
            "flex items-center gap-3",
            isChecked ? "text-green-500" : "text-red-500"
          )}
        >
          {isChecked ? <FaCheck /> : <FaXmark />}
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
}
