
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Logo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let rotationX = 0;
    let rotationY = 0;
    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const deltaX = (mouseX - centerX) / (rect.width / 2);
      const deltaY = (mouseY - centerY) / (rect.height / 2);
      
      rotationY = deltaX * 10;
      rotationX = -deltaY * 10;
      
      updateLogoRotation();
    };
    
    const updateLogoRotation = () => {
      if (!container) return;
      
      const logoElement = container.querySelector('.logo-3d') as HTMLElement;
      if (logoElement) {
        logoElement.style.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      }
    };
    
    const animateBack = () => {
      if (Math.abs(rotationX) < 0.1 && Math.abs(rotationY) < 0.1) {
        cancelAnimationFrame(animationFrameId);
        return;
      }
      
      rotationX *= 0.95;
      rotationY *= 0.95;
      
      updateLogoRotation();
      animationFrameId = requestAnimationFrame(animateBack);
    };
    
    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(animateBack);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative mx-auto"
    >
      <div className="logo-3d transition-transform duration-200 w-48 h-48 md:w-64 md:h-64 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/30 w-48 h-48 md:w-64 md:h-64 rounded-full backdrop-blur-md animate-pulse-light shadow-glow"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg 
            viewBox="0 0 24 24" 
            className="w-24 h-24 md:w-40 md:h-40 text-brand-dark"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12,4c-4.97,0-9,4.03-9,9c0,0.03,0,0.06,0,0.09C3.04,13.06,3.1,13.03,3.15,13C3.68,11.95,4.76,11,6,11 c1.97,0,3.32,1.67,4,3c0.68-1.33,2.03-3,4-3c1.24,0,2.32,0.95,2.85,2c0.05,0.03,0.1,0.06,0.15,0.09c0-0.03,0-0.06,0-0.09 C17,8.03,12.97,4,12,4z M12,17c-1.97,0-3.32-1.67-4-3c-0.68,1.33-2.03,3-4,3c-0.77,0-1.45-0.3-2-0.77V19c0,1.1,0.9,2,2,2h12 c1.1,0,2-0.9,2-2v-2.77c-0.55,0.47-1.23,0.77-2,0.77C15.32,15.33,13.97,13.67,12,17z" 
              fill="currentColor"
            />
          </svg>
        </div>
        
        <div className="absolute inset-0 z-0">
          <div className="absolute left-0 top-0 w-6 h-6 bg-brand/30 rounded-full animate-float blur-sm" style={{animationDelay: '0s'}}></div>
          <div className="absolute right-0 bottom-0 w-8 h-8 bg-brand-light/40 rounded-full animate-float blur-sm" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute right-1/4 top-1/4 w-4 h-4 bg-brand/20 rounded-full animate-float blur-sm" style={{animationDelay: '1s'}}></div>
          <div className="absolute left-1/3 bottom-1/3 w-6 h-6 bg-brand-dark/30 rounded-full animate-float blur-sm" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Logo;
