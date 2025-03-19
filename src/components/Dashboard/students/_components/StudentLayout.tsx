import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import Navbar from "./Navbar";
import { RequireAuth } from "@/lib/auth/RequireAuth";

function StudentLayout() {
  return (
    <RequireAuth>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full overflow-x-hidden">
          {/*  // replace navabar comp with your navbar */}
          <Navbar />
          <Outlet />
        </main>
      </SidebarProvider>
    </RequireAuth>
  );
}

export default StudentLayout;
