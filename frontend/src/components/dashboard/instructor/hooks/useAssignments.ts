import { trpc } from "@/utils/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useAssignments() {
  const { data: assignments } = useSuspenseQuery(
    trpc.assignment.getAllForInstructor.queryOptions(),
  );
  return { assignments };
}
