import { SignupFormValues } from "@/components/auth/pages/Signup";
import axiosInstance from "../client";

const PREFIX = "/student";

export const signupStudent = async (data: SignupFormValues) => {
  const response = await axiosInstance.post(`${PREFIX}/register`, {
    ...data,
    fullName: data.fullname,
  });
  return response.data;
};
