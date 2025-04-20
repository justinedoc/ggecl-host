import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddCourse = () => {
  const { mutate: addCourse, isPending: isAddingCourse } = useMutation(
    trpc.course.create.mutationOptions({
      onSuccess: () => {
        toast.success("Course added successfully!");
      },

      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  return { addCourse, isAddingCourse };
};
