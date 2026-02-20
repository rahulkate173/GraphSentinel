import os
import json
import time
import tempfile
import csv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

API_V1_STR = "/api/v1"
PROJECT_NAME = "RingForge AML Engine"
VERSION = "1.0.0"

app = FastAPI(title=PROJECT_NAME, version=VERSION, openapi_url=f"{API_V1_STR}/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _run_detection(csv_path: str):
    """Parse CSV, detect cycles, return fraud rings and suspicious accounts."""
    transactions = []
    accounts = set()
    graph = {}  # account -> list of outgoing neighbors

    def get_col(row, name):
        if not row:
            return ""
        for k, v in row.items():
            if k and k.lower().strip() == name.lower():
                return str(v or "").strip()
        return ""

    try:
        with open(csv_path, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            for row in reader:
                sid = get_col(row, "sender_id")
                rid = get_col(row, "receiver_id")
                if not sid or not rid:
                    continue
                transactions.append({
                    "transaction_id": get_col(row, "transaction_id") or "",
                    "sender_id": sid,
                    "receiver_id": rid,
                    "amount": get_col(row, "amount") or "0",
                    "timestamp": get_col(row, "timestamp") or "",
                })
                accounts.add(sid)
                accounts.add(rid)
                graph.setdefault(sid, []).append(rid)
    except Exception:
        return {
            "suspicious_accounts": [],
            "fraud_rings": [],
            "transactions": [],
            "summary": {"total_accounts_analyzed": 0, "suspicious_accounts_flagged": 0, "fraud_rings_detected": 0, "processing_time_seconds": 0.0},
        }

    # Simple cycle detection (cycles of length 3–5)
    seen_cycles = set()
    fraud_rings = []
    ring_id = 0

    def find_cycles(path, target, max_len, depth):
        if depth > max_len:
            return
        curr = path[-1]
        for nxt in graph.get(curr, []):
            if nxt == target and len(path) >= 3:
                key = tuple(sorted(path))
                if key not in seen_cycles:
                    seen_cycles.add(key)
                    fraud_rings.append({"members": list(path), "pattern_type": f"cycle_length_{len(path)}", "risk_score": 95.0})
            elif nxt not in path:
                find_cycles(path + [nxt], target, max_len, depth + 1)

    for node in list(graph.keys()):
        find_cycles([node], node, 5, 1)

    # Format fraud_rings for RIFT schema
    formatted_rings = []
    ring_members = set()
    for i, r in enumerate(fraud_rings):
        rid_str = f"RING_{i + 1:03d}"
        formatted_rings.append({
            "ring_id": rid_str,
            "member_accounts": r["members"],
            "pattern_type": r["pattern_type"],
            "risk_score": r["risk_score"],
        })
        ring_members.update(r["members"])

    # Suspicious accounts: all accounts, with scores for ring members
    suspicious_accounts = []
    for acc in accounts:
        score = 80.0 if acc in ring_members else 0.0
        patterns = [r["pattern_type"] for r in fraud_rings if acc in r["members"]]
        rid = next((r["ring_id"] for r in formatted_rings if acc in r["member_accounts"]), None)
        suspicious_accounts.append({
            "account_id": acc,
            "suspicion_score": score,
            "detected_patterns": patterns,
            "ring_id": rid,
        })
    suspicious_accounts.sort(key=lambda x: (-x["suspicion_score"], x["account_id"]))

    return {
        "suspicious_accounts": suspicious_accounts,
        "fraud_rings": formatted_rings,
        "transactions": transactions,
        "summary": {
            "total_accounts_analyzed": len(accounts),
            "suspicious_accounts_flagged": len([a for a in suspicious_accounts if a["suspicion_score"] > 0]),
            "fraud_rings_detected": len(formatted_rings),
            "processing_time_seconds": 0.0,
        },
    }


# Include API router if available (full app structure)
try:
    from app.api.v1 import api_router
    app.include_router(api_router, prefix=API_V1_STR)
except ImportError:
    # Fallback: define routes here so frontend works without app.api
    RESULT_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data_storage", "analysis_results.json")
    os.makedirs(os.path.dirname(RESULT_FILE), exist_ok=True)

    @app.post(f"{API_V1_STR}/anomalies/analyze")
    async def analyze_anomalies(file: UploadFile = File(...)):
        if not file.filename.endswith(".csv"):
            raise HTTPException(400, "Only CSV files allowed")
        suffix = os.path.splitext(file.filename)[1]
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
        try:
            tmp.write(await file.read())
            tmp.close()
            start = time.time()
            out = _run_detection(tmp.name)
            out["summary"]["processing_time_seconds"] = round(time.time() - start, 4)
            os.makedirs(os.path.dirname(RESULT_FILE), exist_ok=True)
            with open(RESULT_FILE, "w") as f:
                json.dump(out, f, indent=4)
            return out
        finally:
            if os.path.exists(tmp.name):
                os.unlink(tmp.name)

    @app.get(f"{API_V1_STR}/anomalies/results")
    async def get_results():
        if not os.path.exists(RESULT_FILE):
            raise HTTPException(404, "No results. Run analysis first.")
        with open(RESULT_FILE) as f:
            return json.load(f)

    @app.get(f"{API_V1_STR}/anomalies/download")
    async def download_results():
        if not os.path.exists(RESULT_FILE):
            raise HTTPException(404, "No results. Run analysis first.")
        return FileResponse(RESULT_FILE, media_type="application/json", filename="money_muling_report.json")


@app.get("/")
def root():
    return {"status": "online", "message": "RingForge AML Engine API", "version": VERSION}


@app.get("/health")
def health():
    return {"status": "healthy"}
