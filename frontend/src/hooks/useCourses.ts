import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export function useCourses({ limit = 4 }: { limit?: number }) {
  const { data, isLoading } = useQuery(
    trpc.course.getAll.queryOptions({ limit }),
  );

  return { courses: data?.courses || [], meta: data?.meta, loading: isLoading };
}
