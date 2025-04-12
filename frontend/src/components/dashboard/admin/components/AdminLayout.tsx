import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import AdminNav from "@/components/dashboard/admin/components/AdminNav";
import { AdminSidebar } from "@/components/dashboard/admin/components/AdminSidebar";
import { isAdmin } from "@/utils/isAdmin";
import { RequireAuth } from "@/components/utils/RequireAuth";
import { AdminContext } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

function AdminLayout() {
  const { userId, isLoading } = useAuth();

  const { data: user, isPending } = useQuery({
    ...trpc.admin.getById.queryOptions({ id: userId || "" }),
    enabled: !!userId && !isLoading,
  });

  if (!isAdmin(user)) {
    return user && "Login as an admin to view your dashboard";
  }

  const admin = user;

  return (
    <RequireAuth isPending={isPending}>
      <AdminContext.Provider value={{ admin }}>
        <SidebarProvider>
          <AdminSidebar />
          {/* Main content */}
          <main className="w-full overflow-x-hidden">
            <AdminNav />
            <Outlet />
          </main>
        </SidebarProvider>
      </AdminContext.Provider>
    </RequireAuth>
  );
}

export default AdminLayout;
