from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from resume_parser import extract_text
from ai_engine import analyze_resume

app = FastAPI(title="RecruitMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "RecruitMind API is running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), jd: str = Form(...)):
    try:
        contents = await file.read()
        resume_text = extract_text(contents)
        result = analyze_resume(resume_text, jd)

        return {
            "success": True,
            "data": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }   