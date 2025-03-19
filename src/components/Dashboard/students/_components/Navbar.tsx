import { useState, useEffect } from "react";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import { useLocation } from "react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Shadcn UI components for popovers and dropdowns
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/AuthContext";

const capsFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const { handleLogout } = useAuth();
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const shouldShowSidebarTrigger = state === "collapsed" || isMobile;

  const location = useLocation();
  const pathname = location.pathname.split("/").at(-1);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 p-5 flex items-center justify-between shadow-md"
      )}
    >
      <div className="flex items-center space-x-4">
        {shouldShowSidebarTrigger && (
          <>
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
          </>
        )}
        <h1 className="text-2xl font-semibold">
          {capsFirstLetter(pathname || "Dashboard")}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <SearchBar />
        </div>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="relative p-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                3
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 space-y-3"
          >
            <p className="text-sm">🔔 New notification 1</p>
            <hr className="border-gray-200 dark:border-gray-700" />
            <p className="text-sm">🔔 New notification 2</p>
            <hr className="border-gray-200 dark:border-gray-700" />
            <p className="text-sm">🔔 New notification 3</p>
          </PopoverContent>
        </Popover>

        {/* Dark Mode Toggle */}
        <Button
          onClick={() => setDarkMode((prev) => !prev)}
          className="w-9 h-9 rounded-full bg-cyan-950 flex items-center justify-center transition-colors hover:bg-blue-400/30"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <img
                src="https://i.pinimg.com/474x/14/88/f3/1488f35bc175631415a048ca5208aa3f.jpg"
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium hidden md:block">
                Josh Dickson
              </span>
              <FaChevronDown className="text-xs" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-60 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4"
          >
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2">
              ⚙ <span className="ml-2">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2">
              🔑 <span className="ml-2">Change Password</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              onClick={() => handleLogout("student")}
              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-md p-2"
            >
              🚪 <span className="ml-2">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
