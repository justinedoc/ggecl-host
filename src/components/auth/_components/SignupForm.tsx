import { CustomLink } from "../ui/CustomLink";
import { FormHead } from "../ui/FormHead";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { InputBox } from "../ui/InputBox";
import { FaXmark } from "react-icons/fa6";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FieldValues, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import GoogleSigninBtn from "../ui/GoogleSigninBtn";
import { Input } from "@/components/ui/input";
import AuthDivider from "../ui/AuthDivider";
import { cn } from "@/lib/utils";

export default function SignupForm({
  onNext,
}: {
  onNext: (data: FieldValues) => void;
}): JSX.Element {
  const [isPasswordHidden, setIsPasswordHidden] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useFormContext()

  function handleCheckPassword(password: string) {
    return [
      {
        message: "One letter",
        isChecked: /[a-z]/.test(password),
      },
      {
        message: "One number",
        isChecked: /[0-9]/.test(password),
      },
      {
        message: "One special character",
        isChecked: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
      {
        message: "6 or more characters",
        isChecked: password.length >= 6,
      },
    ];
  }

  const password: string = watch("password");
  const email: string = watch("email");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPasswordValid = handleCheckPassword(password).every(
    (check) => check.isChecked
  );

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      className="flex flex-col gap-4 w-full md:mt-5 md:p-5"
    >
      <FormHead title="Create an account">
        Already have an account? <CustomLink to="/login">Login</CustomLink>
      </FormHead>

      <InputBox>
        <label className="text-md font-semibold">Email</label>
        <Input
          {...register("email")}
          type="email"
          name="email"
          className={cn(
            "bg-transparent w-full p-2 rounded-sm focus:ring-2 focus:ring-blue-300/30 outline-none shadow-sm border border-blue-300/30",
            { "border-red-500": errors?.email }
          )}
        />

        <aside className="absolute w-fit top-[2.8rem] right-2">
          {errors.email && !isEmailValid ? (
            <FaXmark className="text-red-500" size={22} />
          ) : (
            <FaCheckCircle
              className={email && isEmailValid ? "text-green-500" : "hidden"}
              size={22}
            />
          )}
        </aside>

        {errors.email && (
          <p className="text-red-500 text-xs capitalize">
            {errors.email.message as string}
          </p>
        )}
      </InputBox>

      <InputBox>
        <label className="text-md font-semibold">Password</label>
        <Input
          {...register("password")}
          type={isPasswordHidden ? "password" : "text"}
          name="password"
          className={cn(
            "bg-transparent w-full p-2 rounded-sm focus:ring-2 focus:ring-blue-300/30 outline-none shadow-sm border border-blue-300/30",
            { "border-red-500": errors?.password }
          )}
        />
        {errors.password && (
          <p className="text-red-500 text-xs capitalize">
            {errors.password.message as string}
          </p>
        )}

        {password && (
          <PasswordChecks password={password} checks={handleCheckPassword} />
        )}
        <aside
          className="absolute top-0 right-0 flex gap-2 items-center font-medium cursor-pointer"
          onClick={() => setIsPasswordHidden((isHidden) => !isHidden)}
        >
          {isPasswordHidden ? <IoEye /> : <IoEyeOff />}
          <span>{isPasswordHidden ? "Show" : "Hide"}</span>
        </aside>
      </InputBox>

      <Button
        type="submit"
        disabled={!isPasswordValid || !isEmailValid || !isValid || isSubmitting}
        className="bg-gray-900 border border-blue-300/30 disabled:border-0 disabled:bg-gray-400 dark:disabled:bg-gray-700 dark:text-white font-semibold hover:bg-gray-800"
      >
        {isSubmitting ? "Processing..." : "Proceed"}
      </Button>

      <AuthDivider />

      <GoogleSigninBtn>Continue with Google</GoogleSigninBtn>
      <p className="text-sm text-center">
        By creating an account, you agree to GGECL's{" "}
        <CustomLink to="https://ggecl.com/terms.html">
          Terms of Service
        </CustomLink>
        ,{" "}
        <CustomLink to="https://ggecl.com/terms.html">
          Privacy Policy
        </CustomLink>
      </p>
    </form>
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
          className={`flex items-center gap-3 ${
            isChecked ? "text-green-500" : "text-red-500"
          }`}
        >
          {isChecked ? <FaCheck /> : <FaXmark />}
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
}
