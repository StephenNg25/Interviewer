from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_cohere import CohereEmbeddings, ChatCohere
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA

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
embeddings = CohereEmbeddings(cohere_api_key=cohere_api_key, model="embed-english-v3.0")
vectorstore = Chroma.from_documents(split_docs, embeddings)

llm = ChatCohere(cohere_api_key=cohere_api_key, model="command", temperature=0.3)
retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})
qa_chain = RetrievalQA.from_chain_type(llm, chain_type="stuff", retriever=retriever)

@app.post("/generate-response/")
async def generate_response(
    resume: UploadFile = File(None),
    job_description: str = Form(...),
    user_message: str = Form(...)
):
    resume_text = ""
    if resume:
        temp_pdf = f"temp_{resume.filename}"
        with open(temp_pdf, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
        resume_loader = PyPDFLoader(temp_pdf)
        resume_docs = resume_loader.load()
        resume_text = " ".join([doc.page_content for doc in resume_docs])
        os.remove(temp_pdf)

    prompt = f"""
    Act strictly as a concise, professional recruiter conducting a job interview. Follow these guidelines precisely:

    1. Ask short, direct questions, typically under 20 words, to maintain a clear and professional interaction.
    2. Never include unnecessary details or introductions unless explicitly asked.
    3. Use simple language and avoid overly verbose or redundant phrases.
    4. Ask only one clear question at a time.

    Handling Irrelevant Responses:

    - Immediately recognize and directly address inappropriate, irrelevant, joking, or nonsensical user inputs.
    - Do not humor or continue irrelevant conversations.
    - Use exactly one of the following standard responses to quickly redirect:
    a) "This response isn't relevant to our interview. Please answer appropriately."
    b) "Let's stay professional. Could you please provide a relevant answer?"
    c) "That doesn't pertain to the interview context. Let's refocus."
    - Never answer unrelated questions, jokes, or irrelevant statements. Strictly redirect to the professional context of the interview.

    Job Description: {job_description}
    Resume: {resume_text}
    User Input: {user_message}

    Respond professionally based strictly on recruiter behavior.
    """

    response = qa_chain.invoke(prompt)
    return {"response": response['result']}
