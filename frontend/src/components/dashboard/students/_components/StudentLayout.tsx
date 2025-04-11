import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { AppSidebar } from "./AppSidebar";
import { RequireAuth } from "@/components/utils/RequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { isStudent } from "@/utils/isStudent";
import { StudentContext } from "@/hooks/useStudent";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

function StudentLayout() {
  const { userId, isLoading } = useAuth();

  const { data: user, isPending } = useQuery({
    ...trpc.student.getById.queryOptions({ id: userId || "" }),
    enabled: !!userId && !isLoading,
  });

  if (!isStudent(user)) {
    return user && "Login as a student to view your dashboard";
  }

  const student = user;

  return (
    <RequireAuth isPending={isPending}>
      <StudentContext.Provider value={{ student }}>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full overflow-x-hidden">
            <Navbar />
            <Outlet />
          </main>
        </SidebarProvider>
      </StudentContext.Provider>
    </RequireAuth>
  );
}

export default StudentLayout;
