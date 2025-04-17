import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateAssignment() {
  const { mutate: createAssignment, isPending: isCreatingAssignment } =
    useMutation(
      trpc.assignment.create.mutationOptions({
        onError: (err) => {
          toast.error(err.message);
        },
      }),
    );
  return { createAssignment, isCreatingAssignment };
}
