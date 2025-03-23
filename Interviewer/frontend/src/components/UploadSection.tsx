
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const UploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobDescriptionError, setJobDescriptionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleFileChange = (file: File) => {
    const validTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid resume file (PDF or Word document)");
      return;
    }
    
    setResumeFile(file);
    toast.success(`Resume "${file.name}" uploaded successfully`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const validateJobDescription = (text: string): boolean => {
    // Clear previous error
    setJobDescriptionError("");
    
    // Trim to remove leading/trailing whitespace
    const trimmedText = text.trim();
    
    // Check if empty
    if (!trimmedText) {
      setJobDescriptionError("Job description is required");
      return false;
    }
    
    // Check minimum length (at least 20 characters)
    if (trimmedText.length < 20) {
      setJobDescriptionError("Job description is too short");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!resumeFile && !jobDescription) {
      toast.error("Please upload a resume or enter a job description");
      return;
    }

    if (!jobDescription) {
      setJobDescriptionError("Job description is required");
      toast.error("Please enter a job description");
      return;
    }
    
    if (!validateJobDescription(jobDescription)) {
      toast.error(jobDescriptionError || "Invalid job description");
      return;
    }
    
    toast.success("Processing your request...");
    // Navigate to the interview page with the resume and job description
    navigate("/interview", { state: { resumeFile, jobDescription } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="max-w-2xl mx-auto mt-10"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold text-center mb-4">
          <span className="text-gradient">Jimmy</span>
        </h1>
        <p className="text-gray-700 text-xl font-semibold">Crack the interview with Jimmy</p>
      </motion.div>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="glassmorphism rounded-2xl p-8 soft-shadow"
        >
          <div 
            className={cn(
              "drop-area",
              isDragging && "active"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx"
            />
            
            <div className="text-center">
              {resumeFile ? (
                <div className="py-4 flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-brand-dark" />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{resumeFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-brand/10 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-brand-dark" />
                  </div>
                  <p className="text-gray-700 mb-2">Upload a file to get started</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop your resume, or click to browse
                  </p>
                </>
              )}
              
              <Button 
                className="upload-button bg-brand hover:bg-brand-dark text-white font-medium px-6 py-2 rounded-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                {resumeFile ? "Replace File" : "Upload Resume"}
              </Button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="glassmorphism rounded-2xl p-6 soft-shadow"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder="Paste job description here (required)..."
            className={cn(
              "w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-200",
              jobDescriptionError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
            )}
            rows={5}
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (jobDescriptionError) {
                validateJobDescription(e.target.value);
              }
            }}
          />
          {jobDescriptionError && (
            <div className="mt-2 text-red-500 text-sm flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5" />
              <span>{jobDescriptionError}</span>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">
            <p>The job description should include:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Position title (e.g., Software Engineer, Data Analyst)</li>
              <li>Company information</li>
              <li>Key responsibilities and requirements</li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="flex justify-center"
        >
          <Button 
            className="upload-button bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-6 rounded-lg text-lg"
            onClick={handleSubmit}
          >
            Start Interview
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UploadSection;
