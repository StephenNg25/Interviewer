
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavbarProps {
  logo?: string;
  className?: string;
}

const Navbar = ({ logo = "Perch", className }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 px-6 md:px-12",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 hover-scale"
        >
          <div className="h-9 w-9 rounded-full bg-brand flex items-center justify-center p-1">
            <svg 
              viewBox="0 0 24 24" 
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12,3c-4.97,0-9,4.03-9,9c0,0.03,0,0.06,0,0.09C3.04,12.06,3.1,12.03,3.15,12C3.68,10.95,4.76,10,6,10 c1.97,0,3.32,1.67,4,3c0.68-1.33,2.03-3,4-3c1.24,0,2.32,0.95,2.85,2c0.05,0.03,0.1,0.06,0.15,0.09c0-0.03,0-0.06,0-0.09 C17,7.03,12.97,3,12,3z M12,16c-1.97,0-3.32-1.67-4-3c-0.68,1.33-2.03,3-4,3c-0.77,0-1.45-0.3-2-0.77V18c0,1.1,0.9,2,2,2h12 c1.1,0,2-0.9,2-2v-2.77c-0.55,0.47-1.23,0.77-2,0.77C15.32,14.33,13.97,12.67,12,16z" 
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-xl font-display font-semibold text-gray-900">{logo}</span>
        </Link>

        <div className="flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-gray-800 font-medium link-underline transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-gray-800 font-medium link-underline transition-colors duration-200"
          >
            About
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
