import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "@/components/Dashboard/students/_components/AppSidebar";
import Navbar from "@/components/Dashboard/students/_components/Navbar";
import { RequireAuth } from "@/lib/auth/RequireAuth";

function InstructorLayout() {
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

export default InstructorLayout;
