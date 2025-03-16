import { FieldValues, FormProvider, useForm } from "react-hook-form";
import SignupDetailsForm from "../_components/SignupDetailsForm";
import SignupForm from "../_components/SignupForm";
import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import AuthContainer from "../_components/AuthContainer";

const sleep = (n: number) =>
  new Promise((resolve, _) => setTimeout(resolve, n));

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

function Signup() {
  const [step, setStep] = useState(1);
  const [firstStepData, setFirstStepData] = useState({});

  const firstStepMethods = useForm<z.infer<typeof firstStepSchema>>({
    resolver: zodResolver(firstStepSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const secondStepMethods = useForm<z.infer<typeof secondStepSchema>>({
    resolver: zodResolver(secondStepSchema),
    defaultValues: {
      fullname: "",
      dateOfBirth: "",
      gender: "other",
    },
  });

  const nextStep = (data: FieldValues) => {
    setFirstStepData(data);
    setStep((cur) => cur + 1);
  };

  const prevStep = () => setStep((cur) => (cur > 1 ? cur - 1 : cur));

  const onSubmitSecondStep = async (data: FieldValues): Promise<void> => {
    const finalData = { ...firstStepData, ...data };

    try {
      console.log("loading...");
      await sleep(2000);
      console.log("Final Data:", finalData);
      // navigate("/signup/verify-email", {
      //   state: finalData,
      // });
      // TODO: Add api call here
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      console.log("loading end");
    }
  };

  return (
    <AuthContainer>
      {step > 1 && (
        <button
          onClick={prevStep}
          className="text-xs absolute md:left-[37%] left-3 top-3 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft />
        </button>
      )}

      {step === 1 && (
        <FormProvider {...firstStepMethods}>
          <SignupForm onNext={nextStep} />
        </FormProvider>
      )}
      {step === 2 && (
        <FormProvider {...secondStepMethods}>
          <SignupDetailsForm onSubmit={onSubmitSecondStep} />
        </FormProvider>
      )}
    </AuthContainer>
  );
}

export default Signup;
