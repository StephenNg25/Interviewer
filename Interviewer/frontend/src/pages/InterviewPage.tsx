
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  FileText, 
  X 
} from "lucide-react";
import { generateResponse } from "@/services/cohereService";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const InterviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeFile, jobDescription } = location.state || {};
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if we have the required data
  useEffect(() => {
    if (!resumeFile && !jobDescription) {
      toast.error("Missing resume or job description");
      navigate("/");
    } else {
      // Initial greeting from the AI interviewer
      addMessage("assistant", "Hello! I'm your AI interviewer today. I've reviewed your resume and the job description. How are you feeling about this interview?");
    }
  }, [resumeFile, jobDescription, navigate]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role: "user" | "assistant", content: string, isLoading: boolean = false) => {
    setMessages(prev => [...prev, {
      role,
      content,
      timestamp: new Date(),
      isLoading
    }]);
  };

  const updateLastMessage = (content: string, isLoading: boolean = false) => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        const lastMessage = newMessages[newMessages.length - 1];
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content,
          isLoading
        };
      }
      return newMessages;
    });
  };

  const handleMicToggle = () => {
    if (!isListening) {
      // Start speech recognition (placeholder)
      setIsListening(true);
      toast.info("Listening... Click again to stop.");
      // In a real implementation, this would connect to the Web Speech API
    } else {
      // Stop speech recognition
      setIsListening(false);
      toast.info("Stopped listening");
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isGenerating) return;
    
    // Add user message to chat
    addMessage("user", inputText);
    
    // Clear input field
    setInputText("");
    
    // Add a loading message from the assistant
    addMessage("assistant", "Thinking...", true);
    setIsGenerating(true);
    
    try {
      // Get response from Cohere API through our service
      const response = await generateResponse(resumeFile, jobDescription, inputText);
      
      // Update the loading message with the actual response
      updateLastMessage(response);
    } catch (error) {
      console.error("Error in interview response:", error);
      updateLastMessage("I'm sorry, I encountered an error. Could you try again?");
      toast.error("Failed to generate response");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFinishInterview = () => {
    toast.success("Interview finished! In a complete implementation, feedback would be generated here.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4">
      <div className="max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Interview Window */}
          <div className="md:col-span-2 space-y-6">
            {/* Virtual Interviewer */}
            <Card className="p-6 shadow-md rounded-xl bg-white relative overflow-hidden">
              <div className="flex flex-col items-center justify-center py-10">
                <div className="relative w-48 h-48 mb-6">
                  <Bot className="w-full h-full text-brand-dark" />
                </div>
                <Button
                  onClick={handleMicToggle}
                  className={`rounded-full w-16 h-16 flex items-center justify-center ${
                    isListening ? "bg-red-500 hover:bg-red-600" : "bg-brand hover:bg-brand-dark"
                  }`}
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </Button>
                <p className="mt-4 text-center text-gray-700">
                  {isListening ? "Listening... Click to stop" : "Click to speak"}
                </p>
              </div>
            </Card>
            
            {/* Notes Section */}
            <Card className="p-6 shadow-md rounded-xl bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <FileText className="mr-2" /> Interview Notes
                </h3>
              </div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes during your interview..."
                className="min-h-[150px] text-base"
              />
            </Card>
            
            {/* Finish Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleFinishInterview}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2"
              >
                <X className="mr-2" /> Finish Interview
              </Button>
            </div>
          </div>
          
          {/* Transcript Column */}
          <div className="md:col-span-1">
            <Card className="p-4 shadow-md rounded-xl bg-white h-[calc(100vh-5rem)] flex flex-col">
              <h3 className="text-lg font-semibold mb-4 sticky top-0 bg-white py-2">Transcript</h3>
              
              <div className="flex-grow overflow-y-auto mb-4 pr-2">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                      <div 
                        className={`rounded-lg px-4 py-2 max-w-[90%] ${
                          message.role === "user" 
                            ? "bg-brand-light text-gray-800" 
                            : "bg-gray-100 text-gray-800"
                        } ${message.isLoading ? "animate-pulse" : ""}`}
                      >
                        {message.content}
                        
                        {message.role === "assistant" && !message.isLoading && (
                          <div className="mt-2 text-xs opacity-70 flex items-center">
                            <button className="text-gray-500 hover:text-gray-700">
                              ▶️ Play
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-white pt-2">
                <div className="flex items-center space-x-2">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type to answer..."
                    className="resize-none"
                    rows={2}
                    disabled={isGenerating}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="h-full aspect-square"
                    disabled={isGenerating || !inputText.trim()}
                  >
                    <Send />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
