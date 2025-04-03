import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

function AdminLayout() {
  return (
    <SidebarProvider>
      <main className="w-full overflow-x-hidden">
        {/* TODO: replace navbar and sidebar comp with one for admin */}
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default AdminLayout;
