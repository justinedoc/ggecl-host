import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export function useStudents({ limit = 100 }) {
  const { data, isPending: loadingStudents } = useQuery(
    trpc.student.getAll.queryOptions({ limit }),
  );

  return {
    students: data?.students || [],
    meta: data?.meta,
    loadingStudents,
  };
}
