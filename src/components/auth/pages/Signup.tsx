import { FormProvider, useForm } from "react-hook-form";
import SignupDetailsForm from "../_components/SignupDetailsForm";
import SignupForm from "../_components/SignupForm";
import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import AuthContainer from "../_components/AuthContainer";
import { useCustomNavigate } from "@/hooks/useCustomNavigate";
import { useMutation } from "@tanstack/react-query";
import { signupStudent } from "@/api/services/students";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { formatZodErrors } from "@/lib/formatZodErrors";
import { ErrorResType } from "@/types/errorResponseType";

// Schema for step 1
const firstStepSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Schema for step 2
const secondStepSchema = z.object({
  fullname: z
    .string({ message: "Please enter your full name" })
    .min(2, "Please enter your full name")
    .max(50, "Full name must be 50 characters or less"),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
});

// Merge both schemas into one
const signupSchema = firstStepSchema.merge(secondStepSchema);

export type SignupFormValues = z.infer<typeof signupSchema>;

function Signup() {
  const { navigate } = useCustomNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: signupStudent,
    onSuccess: (data) => {
      toast.success("Registeration successful!");
      console.log(data);
      navigate("/student/dashboard", { replace: true });
    },
    onError: (error: AxiosError) => {
      const errorResponseData = error?.response?.data as ErrorResType<string>;

      if (errorResponseData?.message?.toLowerCase()?.includes("validation")) {
        toast.error(formatZodErrors(errorResponseData));
        return;
      }
      toast.error(
        errorResponseData?.message || "An error occured please try again later"
      );
      console.error("Signup error:", error.response);
    },
  });

  const [step, setStep] = useState(1);
  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullname: "",
      dateOfBirth: "",
      gender: "other",
    },
  });

  // Validate only the fields for the first step before proceeding
  const nextStep = async () => {
    if (step === 1) {
      const isValid = await methods.trigger(["email", "password"]);
      isValid && setStep(2);
    }
  };

  // Final submission handler for step 2
  const onSubmit = (data: SignupFormValues) => {
    mutate(data);
  };

  return (
    <AuthContainer isPending={isPending}>
      {step > 1 && (
        <button
          onClick={() => setStep((cur) => cur - 1)}
          className="text-xs absolute md:left-[37%] left-3 top-3 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft />
        </button>
      )}

      <FormProvider {...methods}>
        {step === 1 && <SignupForm onNext={nextStep} />}
        {step === 2 && <SignupDetailsForm onSubmit={onSubmit} />}
      </FormProvider>
    </AuthContainer>
  );
}

export default Signup;
