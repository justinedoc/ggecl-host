import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { AppSidebar } from "./AppSidebar";
import { RequireAuth } from "@/components/utils/RequireAuth";

function StudentLayout() {
  return (
    <RequireAuth>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full overflow-x-hidden">
          <Navbar />
          <Outlet />
        </main>
      </SidebarProvider>
    </RequireAuth>
  );
}

export default StudentLayout;
