import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormHead } from "../ui/FormHead";
import { DarkOverlay } from "../ui/DarkOverlay";
import LoadingAnim from "../ui/LoadingAnim";
import AuthDivider from "../ui/AuthDivider";
import GoogleSigninBtn from "../ui/GoogleSigninBtn";
import { CustomLink } from "../ui/CustomLink";
import { SignupFormValues } from "../pages/Signup";

interface SignupDetailsFormProps {
  onSubmit: (data: SignupFormValues) => void;
}

function SignupDetailsForm({ onSubmit }: SignupDetailsFormProps): JSX.Element {
  const form = useFormContext<SignupFormValues>();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full md:p-5 relative"
      >
        <FormHead title="Tell us about yourself">
          Let us know more about you
        </FormHead>

        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Full Name Here"
                  {...field}
                  className="dark:bg-gray-900 py-6 outline-none shadow-sm border border-blue-300/30 dark:border-blue-300/20"
                />
              </FormControl>
              <FormDescription>
                This should appear exactly as in your documents
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}
              >
                <FormControl>
                  <SelectTrigger className="dark:bg-gray-900 py-6 outline-none shadow-sm border border-blue-300/30 dark:border-blue-300/20">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:bg-gray-900 dark:border-blue-300/30">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value || ""}
                  className="dark:bg-gray-900 py-6 outline-none shadow-sm border border-blue-300/30 dark:border-blue-300/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="my-3">
          Signup
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
      {form.formState.isSubmitting && (
        <DarkOverlay>
          <LoadingAnim />
        </DarkOverlay>
      )}
    </Form>
  );
}

export default SignupDetailsForm;
