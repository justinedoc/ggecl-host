// Navbar.tsx (Improved)
import { useState, useEffect } from "react";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { useAuth } from "@/contexts/AuthContext";
import { Student } from "@/types/userTypes";
import { Link } from "react-router";
import AuthPageLoading from "@/components/auth/_components/AuthPageLoading";

const formatName = (name: string) => {
  const [firstName, ...rest] = name.split(" ");
  return `${firstName} ${rest.map((n) => n[0]).join(". ")}.`;
};

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const shouldShowSidebarTrigger = state === "collapsed" || isMobile;

  const { user, isLoading, handleLogout } = useAuth();

  if (isLoading) return <AuthPageLoading />;
  if (!user) return null;

  const student = user as Student;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <nav
      className={cn(
        "bg-background text-foreground px-6 py-4 flex items-center justify-between border-b",
        "dark:border-gray-800 shadow-sm"
      )}
    >
      <div className="flex items-center gap-4">
        {shouldShowSidebarTrigger && (
          <>
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <SearchBar placeholderText="Search courses..." />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <FaBell className="h-[1.2rem] w-[1.2rem]" />
              {student?.notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs h-5 w-5 rounded-full flex items-center justify-center">
                  {student.notifications.map((n) => !n.isRead).length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <div className="px-2 py-1.5 text-sm font-semibold my-2">
              Notifications
            </div>
            <Separator />
            {student?.notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            ) : (
              student?.notifications.map((notification, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger asChild>
                    <div className="p-3 text-sm hover:bg-accent rounded cursor-pointer">
                      {notification.title}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>{notification.content}</HoverCardContent>
                </HoverCard>
              ))
            )}
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <img
                src={student.picture}
                alt={student.fullName}
                className="h-8 w-8 rounded-full"
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  {formatName(student.fullName)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {student.email}
                </span>
              </div>
              <FaChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuItem asChild>
              <Link to="/student/dashboard/settings" className="cursor-pointer">
                ⚙️ Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>🔒 Privacy & Security</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLogout("student")}
              className="text-destructive focus:text-destructive"
            >
              🚪 Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
