import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export function useInstructors({ limit = 100 }) {
  const { data, isPending: loadingInstructors } = useQuery(
    trpc.instructor.getAll.queryOptions({ limit }),
  );

  return {
    instructors: data?.instructors || [],
    meta: data?.meta,
    loadingInstructors,
  };
}
