import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { RequireAuth } from "@/components/utils/RequireAuth";
import InstructorNav from "@/components/dashboard/instructor/_components/InstructorNav";
import { InstructorSide } from "@/components/dashboard/instructor/_components/InstructorSide";

function InstructorLayout() {
  return (
    <RequireAuth>
      <SidebarProvider>
        <InstructorSide />
        <main className="w-full overflow-x-hidden">
          <InstructorNav />
          <Outlet />
        </main>
      </SidebarProvider>
    </RequireAuth>
  );
}

export default InstructorLayout;
