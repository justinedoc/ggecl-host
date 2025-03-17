import { FormProvider, useForm } from "react-hook-form";
import SignupDetailsForm from "../_components/SignupDetailsForm";
import SignupForm from "../_components/SignupForm";
import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import AuthContainer from "../_components/AuthContainer";
import { useCustomNavigate } from "@/hooks/useCustomNavigate";

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
  const [step, setStep] = useState(1);
  const { navigate } = useCustomNavigate();

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
      console.log("here");
      if (isValid) {
        setStep(2);
      }
    }
  };

  // Final submission handler for step 2
  const onSubmit = async (data: SignupFormValues) => {
    try {
      console.log("Final Data:", data);
      // Simulate async call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/student/dashboard", { replace: true });
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <AuthContainer>
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
