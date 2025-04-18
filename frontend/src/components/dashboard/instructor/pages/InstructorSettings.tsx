import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage, // Import FormMessage to display errors
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useInstructor } from "@/hooks/useInstructor";
import { useUpdateInstructorPassword } from "../hooks/useUpdateInstructorPassword";
import { useUpdateInstructor } from "../hooks/useUpdateInstructor";
import { Textarea } from "@/components/ui/textarea";
import { toBase64 } from "@/utils/toBase64";

// --- Zod Schemas ---

// Schema for Account Information
const accountFormSchema = z.object({
  fullName: z.string().min(1, { message: "Full Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  bio: z.string().optional(),
});

// Schema for Password Change
const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required." }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your new password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// --- Types from Zod Schemas ---
type AccountFormValues = z.infer<typeof accountFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const InstructorSettings: React.FC = () => {
  const { instructor } = useInstructor();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const { isUpdatingInstructor, updateInstructor } = useUpdateInstructor();
  const { isUpdatingInstructorPassword, updateInstructorPassword } =
    useUpdateInstructorPassword();

  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      fullName: instructor.fullName || "",
      email: instructor.email || "",
      bio: instructor.bio || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Image size should be under 1MB.");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      console.log("Selected file:", file);

      toBase64(file, setBase64Image);
    }
  };

  const onSubmitAccount = async (values: AccountFormValues) => {
    const updateData = {
      ...(instructor.email !== values.email && { email: values.email }),
      ...(instructor.bio !== values.bio && { bio: values.bio }),
      ...(instructor.fullName !== values.fullName && {
        fullName: values.fullName,
      }),
      ...(base64Image && { picture: base64Image }),
    };

    if (Object.keys(updateData).length === 0) {
      toast.info("No changes detected.");
      return;
    }

    console.log("Account details:", updateData);

    updateInstructor({
      data: updateData,
      id: instructor._id.toString(),
    });
  };

  const onSubmitPassword = async (values: PasswordFormValues) => {
    const { currentPassword, newPassword } = values;
    console.log(currentPassword, newPassword);
    if (currentPassword === newPassword) {
      toast.info("New password cannot be the same as your old password");
      return;
    }
    updateInstructorPassword({ currentPassword, newPassword });
  };

  return (
    <div className="p-6 text-gray-800 md:p-8 dark:text-gray-200">
      <h1 className="text-3xl font-bold md:text-4xl">Account Settings</h1>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-10">
        {/* Account Info Form */}
        <div className="col-span-10 rounded-lg border p-4 md:col-span-7 dark:border-gray-700">
          <h2 className="mb-6 text-2xl font-semibold">Profile Information</h2>
          <Form {...accountForm}>
            <form
              onSubmit={accountForm.handleSubmit(onSubmitAccount)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={accountForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={accountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your email"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Let your students know more about you..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isUpdatingInstructor}
                className="mt-2 self-start"
              >
                {isUpdatingInstructor ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Image Upload Section */}
        <div className="col-span-10 flex flex-col items-center justify-start gap-4 rounded-lg border p-4 md:col-span-3 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold">Profile Picture</h3>
          <div className="relative">
            <img
              src={selectedImage || instructor.picture}
              alt="User Profile"
              className="h-36 w-36 rounded-full border border-gray-300 object-cover dark:border-gray-700"
            />
            <label
              htmlFor="imageUpload"
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-sm text-white opacity-0 transition-opacity hover:opacity-100"
            >
              Click to Upload
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <p className="w-40 text-center text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, WEBP up to 2MB. <br /> Recommended 1:1 ratio.
          </p>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="mt-10 max-w-md rounded-lg border p-4 dark:border-gray-700">
        <h2 className="mb-6 text-2xl font-semibold">Change Password</h2>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className="flex flex-col gap-6"
          >
            {(
              [
                { name: "currentPassword", label: "Current Password" },
                { name: "newPassword", label: "New Password" },
                { name: "confirmPassword", label: "Confirm New Password" },
              ] as const
            ).map(({ name, label }) => (
              <FormField
                key={name}
                control={passwordForm.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-2/3 right-3 -translate-y-1/2 transform cursor-pointer text-gray-500 dark:text-gray-400"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              disabled={isUpdatingInstructorPassword}
              className="mt-2 self-start"
            >
              {isUpdatingInstructorPassword ? "Saving..." : "Save Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InstructorSettings;
