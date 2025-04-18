import { trpc } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMarkAssignmentSubmissionComplete() {
  const queryClient = useQueryClient();
  const { mutateAsync: markSubmissionComplete } = useMutation(
    trpc.assignment.markSubmissionComplete.mutationOptions({
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAllForInstructor.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAllForStudent.queryKey(),
        });
      },
    }),
  );
  return { markSubmissionComplete };
}
