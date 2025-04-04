import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@backend/src/routers/appRouter";
import { API_URL, authProvider } from "./client";

export const queryClient = new QueryClient();

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: API_URL + "/trpc",
      headers() {
        return {
          Authorization: `Bearer ${authProvider.getAccessToken()}`,
        };
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
