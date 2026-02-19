import os
import time
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

# 1. Initialize FastAPI
app = FastAPI(title="RIFT 2026 Money Muling Detection API")

# 2. Enable CORS (Critical for Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. File Path Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STORAGE_PATH = os.path.join(BASE_DIR, "data_storage")
RESULT_FILE = os.path.join(STORAGE_PATH, "analysis_results.json")

if not os.path.exists(STORAGE_PATH):
    os.makedirs(STORAGE_PATH)

# --- 🧠 ML TEAM: INSERT LOGIC HERE ---
def run_detection_engine(csv_path: str):
    """
    HANDOFF NOTE:
    ML Team, replace the code below with your Graph Theory logic.
    Ensure the returned dictionary follows the mandatory RIFT JSON schema.
    """
    # Placeholder return structure
    return {
        "suspicious_accounts": [], # List of dicts: account_id, suspicion_score, etc.
        "fraud_rings": [],         # List of dicts: ring_id, member_accounts, etc.
        "summary": {
            "total_accounts_analyzed": 0,
            "suspicious_accounts_flagged": 0,
            "fraud_rings_detected": 0,
            "processing_time_seconds": 0.0
        }
    }

# --- ROUTES ---

@app.get("/")
def health_check():
    return {"status": "online", "message": "Backend Middleware is Ready"}

@app.post("/input")
async def upload_and_process(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Upload CSV only.")

    try:
        # Save CSV
        input_csv = os.path.join(STORAGE_PATH, "current_analysis.csv")
        with open(input_csv, "wb") as f:
            f.write(await file.read())

        # Call the Engine
        start_time = time.time()
        results = run_detection_engine(input_csv)
        results["summary"]["processing_time_seconds"] = round(time.time() - start_time, 4)

        # Save to JSON for the /output route
        with open(RESULT_FILE, "w") as f:
            json.dump(results, f, indent=4)

        return {"status": "Analysis Complete", "download_route": "/output"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backend Error: {str(e)}")

@app.get("/output")
async def download_results():
    if not os.path.exists(RESULT_FILE):
        raise HTTPException(status_code=404, detail="No results found.")
    
    return FileResponse(
        path=RESULT_FILE,
        media_type="application/json",
        filename="money_muling_report.json"
    )