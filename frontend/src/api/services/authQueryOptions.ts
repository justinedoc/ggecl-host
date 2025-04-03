// import { toast } from "sonner";
// import { formatZodErrors } from "@/lib/formatZodErrors";
// import { AxiosError } from "axios";
// import { loginStudent } from "@/api/services/students";

// import { queryOptions } from "@tanstack/react-query";
// import { useCustomNavigate } from "@/hooks/useCustomNavigate";
// import { useAuth } from "@/contexts/AuthContext";
// import { LoginResponseSchema } from "@/schemas/studentResponse";
// import { ErrorResType } from "@/types/errorResponseType";

// export function studentLoginQueryOptions() {
//   const { navigate } = useCustomNavigate();
//   const { handleLogin } = useAuth();

//   return queryOptions({
//     onSuccess: (data) => {
//       try {
//         const validatedData = LoginResponseSchema.parse(data.data);
//         handleLogin(validatedData.accessToken);
//         toast.success("Login successful! Welcome back");
//         navigate("/student/dashboard", { replace: true });
//       } catch (parseError) {
//         console.error("Data validation failed:", parseError);
//         toast.error("Unexpected response from server. Please try again.");
//       }
//     },
//     onError: (error: AxiosError) => {
//       const errorResponseData = error?.response?.data as ErrorResType<string>;
//       if (errorResponseData?.message?.toLowerCase()?.includes("validation")) {
//         toast.error(formatZodErrors(errorResponseData));
//         return;
//       }
//       toast.error(
//         errorResponseData?.message ||
//           "An error occurred, please try again later"
//       );
//       console.error("Login error:", error.response || error);
//     },
//   });
// }
