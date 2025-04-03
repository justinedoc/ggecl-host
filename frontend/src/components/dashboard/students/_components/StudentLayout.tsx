import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { AppSidebar } from "./AppSidebar";
// import { RequireAuth } from "@/components/utils/RequireAuth";

//TODO: add in require auth

function StudentLayout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full overflow-x-hidden">
          <Navbar />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

export default StudentLayout;
