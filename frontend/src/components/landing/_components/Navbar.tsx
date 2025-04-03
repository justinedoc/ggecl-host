import { useState } from "react";
import { Link } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import { Moon, ShoppingCart, Sun } from "lucide-react";
import lightImg from "@/assets/images/LOGO.png";
import darkImg from "@/assets/images/LOGO-dark.png";
import { useTheme } from "@/hooks/useTheme";
import { links } from "@/components/constants/Navlinks";

const Navbar = ({ showNav }: { showNav?: boolean }) => {
  const { darkMode, setDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const logoSrc = darkMode ? lightImg : darkImg;

  return (
    <nav className="sticky top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-sm z-50 transition-all duration-300 ease-in-out py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-5 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            <img src={logoSrc} alt="Logo" width={55} />
          </Link>

          {!showNav ? (
            <SearchBar />
          ) : (
            <div className="hidden md:flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors duration-150 font-bold"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button className="hidden md:block font-bold text-gray-700 dark:text-gray-300 border bg-transparent hover:bg-[#123354] hover:text-white transition duration-300 border-cyan-900 rounded-md">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="hidden md:block text-white font-bold rounded-md btn">
                Get Started
              </Button>
            </Link>

            <Link
              to={"/cart"}
              className="hidden size-9 rounded-full bg-blue-300/30 md:flex items-center justify-center hover:bg-blue-300/80 transition-all"
            >
              <ShoppingCart size={18} />
            </Link>
            {/* Dark mode toggle */}
            <Button
              size={"icon"}
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Toggle Dark Mode"
              className="ring rounded-full"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-gray-800 dark:text-white"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-4 flex flex-col p-5 gap-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-700 dark:text-gray-400 hover:text-blue-500 font-bold"
              onClick={() => setMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          <Link
            onClick={() => setMenuOpen(false)}
            to={"/cart"}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 font-bold"
          >
            Cart
          </Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <Button className="w-full font-bold text-gray-700 dark:text-gray-300 ring bg-transparent hover:bg-[#123354] transition duration-300 border-blue-300/20 rounded-md">
              Login
            </Button>
          </Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)}>
            <Button className="w-full text-white font-bold rounded-md bg-gray-900 hover:text-gray-600">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
