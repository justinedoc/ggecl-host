import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { RequireAuth } from "@/components/utils/RequireAuth";

function InstructorLayout() {
  return (
    <RequireAuth>
      <SidebarProvider>
        <main className="w-full overflow-x-hidden">
          {/* TODO: replace navbar and sidebar comp with one for instructor */}
          <Outlet />
        </main>
      </SidebarProvider>
    </RequireAuth>
  );
}

export default InstructorLayout;
