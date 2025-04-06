import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import AdminNav from "@/components/dashboard/admin/components/AdminNav"; 
import { AdminSidebar } from "@/components/dashboard/admin/components/AdminSidebar"; 

function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      {/* Main content */}
      <main className="w-full overflow-x-hidden">
        <AdminNav />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default AdminLayout;
