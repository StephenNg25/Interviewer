
import Navbar from "@/components/Navbar";
import About from "@/components/About";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="pt-24">
        <About />
      </div>
    </div>
  );
};

export default AboutPage;
