
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import UploadSection from "@/components/UploadSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-brand-light/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-10 md:space-y-16">
            {/* Logo Section */}
            <img style = {{width : "25%"}} src = "https://i.ibb.co/CKJx8N8P/image.png"></img>
            
            {/* Upload Section */}
            <UploadSection />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="py-6 text-center text-gray-500 text-sm"
      >
        <p>© {new Date().getFullYear()} Perch. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default Index;
