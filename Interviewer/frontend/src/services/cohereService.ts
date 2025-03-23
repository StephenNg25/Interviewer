// src/services/cohereService.ts

export const generateResponse = async (
  resumeFile: File | null,
  jobDescription: string,
  messages:  Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isLoading?: boolean;
  }>
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("job_description", jobDescription);
    formData.append("messages", JSON.stringify(messages));

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    const response = await fetch("http://localhost:8000/generate-response/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend error: ${errorData.detail || response.statusText}`);
    }

    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm sorry, I encountered an error processing your response. Could you try again?";
  }
};

export const generateSummary = async (
  resumeFile: File | null,
  jobDescription: string,
  messages:  Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isLoading?: boolean;
  }>
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("job_description", jobDescription);
    formData.append("messages", JSON.stringify(messages));

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    const response = await fetch("http://localhost:8000/generate-summary/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Backend error: ${errorData.detail || response.statusText}`);
    }

    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm sorry, I encountered an error processing your response. Could you try again?";
  }
};
