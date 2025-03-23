from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import json
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_cohere import CohereEmbeddings, ChatCohere
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
import cohere 

app = FastAPI()

# Allow CORS for all origins (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load recruiter PDF data into vectorstore on startup
pdf_folder_path = "./data"
all_docs = []
for filename in os.listdir(pdf_folder_path):
    if filename.lower().endswith(".pdf"):
        file_path = os.path.join(pdf_folder_path, filename)
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        all_docs.extend(docs)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
split_docs = text_splitter.split_documents(all_docs)


cohere_api_key = "WNR1gpEdbnZWp5yyaQqpcOTTtSJS49nAG52Whym5"

co = cohere.ClientV2(api_key=cohere_api_key)

@app.post("/generate-response/")
async def generate_response(
    resume: UploadFile = File(None),
    job_description: str = Form(...),
    messages: str = Form(...)
):

    messages = json.loads(messages)

    resume_text = ""
    if resume:
        temp_pdf = f"temp_{resume.filename}"
        with open(temp_pdf, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
        resume_loader = PyPDFLoader(temp_pdf)
        resume_docs = resume_loader.load()
        resume_text = " ".join([doc.page_content for doc in resume_docs])
        os.remove(temp_pdf)

    # Load all PDF files in the /data directory
    pdf_folder_path = "./data"
    all_docs = []

    # Iterate through PDF files in the folder and load their content
    for filename in os.listdir(pdf_folder_path):
        if filename.lower().endswith(".pdf"):  # Check for PDF files
            file_path = os.path.join(pdf_folder_path, filename)
            loader = PyPDFLoader(file_path)
            docs = loader.load()
            all_docs.extend(docs)  # Collect all loaded pages into all_docs

    # Split the loaded documents into smaller chunks using RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    split_docs = text_splitter.split_documents(all_docs)  # Now split_docs contains chunks from all PDFs

    documents = [
        {"data": {"text": doc.page_content}}  # Format each document as a 'data' dictionary with the 'text' field
        for doc in split_docs  # Loop through all split documents
    ]

    print(documents)

    system_message = f"""
    You are a professional recruiter hiring conducting a job interview for a software engineering role.
    Have a conversation with the candidate, asking a mix of both behavioural, and technical questions. Be concise in your responses,
    ask one question at a time, and move on to a different question after a maximum of one follow up question.
    The candidate's resume, and the job description for the position you are recruiting for are provided below:

    Resume: {resume_text}
    Job Description: {job_description}
    """

    
    res = co.chat(
        model="command-a-03-2025",
        messages=[{"role": "system", "content": system_message}] + messages,
    )   

    return {"response": res.message.content[0].text}

@app.post("/generate-summary/")
async def generate_summary(
    resume: UploadFile = File(None),
    job_description: str = Form(...),
    messages: str = Form(...)
):
    system_message = """You are an AI designed to review interview transcripts and provide detailed, constructive feedback on the interview performance. Your goal is to assess the interview objectively, offering honest and insightful analysis on the candidate’s responses, communication style, and overall impression. Consider the following aspects in your evaluation:

    Clarity & Coherence: Were the candidate's answers clear and well-structured? Did they stay on topic and articulate their thoughts effectively?

    Depth of Responses: Did the candidate provide insightful and thorough answers, or were their responses vague and lacking detail?

    Relevance: Did the candidate address the question directly, or did they go off on tangents? Were their examples and experiences relevant to the position?

    Confidence & Engagement: Did the candidate demonstrate confidence and enthusiasm? Did they engage well with the interviewer?

    Technical & Behavioral Fit: Based on their answers, does the candidate seem to possess the necessary skills and cultural fit for the role?

    Areas for Improvement: Identify specific weaknesses in the interview, such as unclear explanations, lack of depth, or poor structuring of responses. Provide actionable suggestions on how they can improve.

    Overall Assessment: Summarize the candidate's strengths and weaknesses, providing a final evaluation of their performance."*

    "Be objective, specific, and constructive. If needed, include examples from the transcript to support your analysis. Your feedback should be professional and useful for the candidate to refine their interview skills."""

    messages = json.loads(messages)
    print(messages)
    resume_text = ""
    if resume:
        temp_pdf = f"temp_{resume.filename}"
        with open(temp_pdf, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
        resume_loader = PyPDFLoader(temp_pdf)
        resume_docs = resume_loader.load()
        resume_text = " ".join([doc.page_content for doc in resume_docs])
        os.remove(temp_pdf)
    messages.pop()
    res = co.chat(
        model="command-a-03-2025",
        messages=[{"role": "system", "content": system_message}] + messages + [{"role": "system", "content": "Based on our conversation today, could you give me some feedback on my responses? Please only respond with the feedback and nothing else."}]
        
    )   

    return {"response": res.message.content[0].text}
