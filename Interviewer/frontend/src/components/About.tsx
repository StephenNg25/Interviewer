
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          About <span className="text-gradient">Perch</span>
        </h1>
        <div className="h-1 w-20 bg-brand mx-auto"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-8"
      >
        <div className="glassmorphism rounded-2xl p-8 soft-shadow">
          <h2 className="text-2xl font-display font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Perch aims to empower job seekers by providing intelligent resume analysis and 
            matching services. We help bridge the gap between your skills and job requirements,
            giving you the insights you need to stand out in the application process.
          </p>
        </div>

        <div className="glassmorphism rounded-2xl p-8 soft-shadow">
          <h2 className="text-2xl font-display font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center mr-4">
                <span className="text-brand-dark font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Upload Your Resume</h3>
                <p className="text-gray-600">Submit your resume in PDF or Word format.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center mr-4">
                <span className="text-brand-dark font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Add Job Description</h3>
                <p className="text-gray-600">Paste the job description you're interested in.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center mr-4">
                <span className="text-brand-dark font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Crack Your Interview With Our Virtual Recruiter</h3>
                <p className="text-gray-600">Engage in a realistic, simulated interview guided by an AI-powered virtual recruiter who adapts questions based on your resume, the job description, and company insights.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center mr-4">
                <span className="text-brand-dark font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Get Personalized Insights</h3>
                <p className="text-gray-600">Receive detailed analysis and tailored recommendations.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glassmorphism rounded-2xl p-8 soft-shadow">
          <h2 className="text-2xl font-display font-semibold mb-4">Our Technology</h2>
          <p className="text-gray-700 leading-relaxed">
            We leverage advanced natural language processing and machine learning algorithms to 
            analyze resumes and job descriptions. Our technology identifies key skills, experience, 
            and qualifications that match or need improvement, providing you with actionable insights.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
