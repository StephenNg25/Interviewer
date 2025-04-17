# Jimmy: AI Interview Simulator ([Demo Here](https://www.youtube.com/watch?v=cjplGaNeFnc))

Jimmy is an AI-powered mock interview platform that simulates recruiter-style interviews based on your resume and a job description. Designed to help candidates prepare for behavioral interviews, Jimmy offers realistic voice-based Q&A, strict recruiter persona interaction, and detailed performance feedback.

![jimmy1](https://github.com/user-attachments/assets/02b3e0cf-9f35-46a6-9067-b5e48184d0d0)

## 🤖How It Works

Jimmy takes in a user's resume and job description and uses a Cohere-powered Retrieval-Augmented Generation (RAG) pipeline to simulate a recruiter. It mimics common recruiter behaviors, asking dynamic follow-ups and evaluating responses.

### Key Features
- **RAG-based prompt injection** using recruiter transcripts
- **Voice-to-text** and **text-to-speech** interaction (via Web Speech API) 
- **PDF resume parsing** and semantic analysis
- **Custom feedback generation** based on STAR criteria

## ⚙️Architecture

**Frontend:**

- Built with **React** and **Tailwind CSS**
- Uses the **Web Speech API** for bi-directional voice interaction
- Displays chat history, transcript, and final feedback

**Backend:**
- Powered by **FastAPI** (Python)
- Uses **LangChain** with **Cohere Command R+** and **ChromaDB** for document similarity retrieval
- Handles resume uploads and parses them via **PyPDFLoader**
- Stores recruiter transcript PDFs for contextual grounding

**LLM/RAG Stack:**
- **CohereEmbeddings** to vectorize transcript chunks
- **Chroma** as the vector database
- **RetrievalQA chain** via LangChain to inject relevant recruiter context into prompts



## ⚡ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/Interviewer.git
cd Interviewer
```

### 2. Set Up Virtual Environment
```bash
python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```
Ensure your `requirements.txt` includes:
```
fastapi
uvicorn
langchain
langchain-cohere
chromadb
PyPDF2
cohere
python-dotenv
```

### 4. Modify your API key
Update `main.py` with your own CohereAPI key:
```
cohere_api_key=your_key_here
```

### 5. Start the Backend Server
```bash
uvicorn main:app --reload
```

### 6. Frontend Setup
Navigate to the `frontend/` directory and run:
```bash
npm install
npm run dev
```



## 📊 Data Flow Overview

1. **User uploads resume & job description** on frontend
2. **Resume parsed into text** by backend via `PyPDFLoader`
3. **Job + resume + user message** passed into LangChain RAG pipeline
4. **Relevant recruiter behavior** is retrieved from ChromaDB
5. **Cohere Command R+** generates a recruiter-like response
6. **Response is spoken out loud** (TTS) and logged in transcript
7. **At end**, model evaluates responses and outputs feedback

![jimmy2](https://github.com/user-attachments/assets/6d70f538-3ebd-43ab-b5c8-0873ad7aba79)
![jimmy3](https://github.com/user-attachments/assets/cf72987e-6aed-4e45-b78c-15b4c67b103f)

## 📍 License
MIT License

