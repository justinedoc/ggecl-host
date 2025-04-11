import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { RequireAuth } from "@/components/utils/RequireAuth";
import InstructorNav from "@/components/dashboard/instructor/_components/InstructorNav";
import { InstructorSide } from "@/components/dashboard/instructor/_components/InstructorSide";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { InstructorContext } from "@/hooks/useInstructor";
import { isInstructor } from "@/utils/isInstructor";

function InstructorLayout() {
  const { userId, isLoading } = useAuth();

  const { data: user, isPending } = useQuery({
    ...trpc.instructor.getById.queryOptions({ id: userId || "" }),
    enabled: !!userId && !isLoading,
  });

  if (!isInstructor(user)) {
    return user && "Login as an instructor to view your dashboard";
  }

  const instructor = user;

  return (
    <RequireAuth isPending={isPending}>
      <InstructorContext.Provider value={{ instructor }}>
        <SidebarProvider>
          <InstructorSide />
          <main className="w-full overflow-x-hidden">
            <InstructorNav />
            <Outlet />
          </main>
        </SidebarProvider>
      </InstructorContext.Provider>
    </RequireAuth>
  );
}

export default InstructorLayout;
