import { SidebarProvider } from "@/components/ui/sidebar";
import {  Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import Navbar from "./Navbar";


function StudentLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-x-hidden">
        {/*  // replace navabar comp with your navbar */}
        <Navbar />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default StudentLayout;
