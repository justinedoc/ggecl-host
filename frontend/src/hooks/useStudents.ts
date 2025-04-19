import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export function useStudents({
  page = 1,
  limit = 10,
  search = "",
  instructor
}: {
  page?: number;
  limit?: number;
  search?: string;
  instructor?: string
}) {
  const { data, isLoading } = useQuery(
    trpc.student.getAll.queryOptions({ page, limit, search, instructor }),
  );

  return {
    students: data?.students ?? [],
    meta: data?.meta,
    loading: isLoading,
  };
}
