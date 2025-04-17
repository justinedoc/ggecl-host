// import { trpc } from "@/utils/trpc";
// import { useQuery } from "@tanstack/react-query";

// export function useAdmins({ limit = 100 }) {
//   const { data, isPending: loadingAdmins } = useQuery(
//     trpc.admin.getAll.queryOptions({ limit }),
//   );

//   return {
//     admins: data?.admins || [],
//     meta: data?.meta,
//     loadingAdmins,
//   };
// }
