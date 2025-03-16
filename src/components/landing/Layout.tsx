import { Outlet } from "react-router";
import Navbar from "./_components/Navbar";
import Footer from "./pages/Footer";
import ScrollToTop from "./_components/ScrollToTop";
function Layout() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
