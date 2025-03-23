
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavbarProps {
  logo?: string;
  className?: string;
}

const Navbar = ({ logo = "Jimmy", className }: NavbarProps) => {
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
          <div className="h-9 w-9 rounded-full  flex items-center justify-center p-1">
            <img src = "https://i.ibb.co/CKJx8N8P/image.png"></img>
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
