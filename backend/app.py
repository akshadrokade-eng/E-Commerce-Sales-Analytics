"""
E-Commerce Analytics Backend API
================================
A lightweight FastAPI server for dataset upload and processing.

Datasets are stored in-memory and keyed by browser-tab session ID (X-Session-ID header).
Data is NOT persisted to disk — closing the tab or restarting the server clears everything.

Run:
    uvicorn backend.app:app --host 0.0.0.0 --port 8000

Environment variables:
    FRONTEND_URL  - Allowed CORS origin (default: http://localhost:3000)
    PORT          - Server port (default: 8000)
"""

import os
import sys
import json
import shutil
import tempfile
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from python.process_dataset import process_csv, get_preview_data
import pandas as pd

app = FastAPI(
    title="E-Commerce Analytics API",
    description="API for uploading and processing e-commerce datasets",
    version="1.0.0",
)

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DASHBOARD_FILES = [
    "summary.json", "category.json", "region.json", "payment.json",
    "yearly.json", "monthly.json", "customers.json", "operations.json",
    "relationships.json",
]

# In-memory session store: session_id -> { "metadata": {...}, "data": { "summary.json": [...], ... } }
_sessions: dict[str, dict] = {}


def _get_session_id(request: Request) -> str:
    sid = request.headers.get("X-Session-ID", "")
    if not sid:
        raise HTTPException(status_code=400, detail={"success": False, "message": "Missing X-Session-ID header"})
    return sid


@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.get("/api/dataset")
async def get_dataset_info(request: Request):
    sid = _get_session_id(request)
    session = _sessions.get(sid)
    if session and "metadata" in session:
        return {"success": True, "has_dataset": True, "metadata": session["metadata"]}
    return {"success": True, "has_dataset": False, "metadata": None, "message": "No dataset loaded"}


@app.post("/api/preview")
async def preview_dataset(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail={"success": False, "message": "Please select a CSV file."})

    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        df = pd.read_csv(temp_path)
        df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]

        preview = get_preview_data(df, num_rows=5)
        preview["filename"] = file.filename
        preview["file_size"] = os.path.getsize(temp_path)

        return {"success": True, "preview": preview}

    except Exception as e:
        raise HTTPException(status_code=400, detail={"success": False, "message": f"Error reading CSV: {str(e)}"})
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


@app.post("/api/upload")
async def upload_dataset(request: Request, file: UploadFile = File(...)):
    sid = _get_session_id(request)

    if not file.filename.lower().endswith(".csv"):
        return JSONResponse(status_code=400, content={"success": False, "message": "Please select a CSV file."})

    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = os.path.getsize(temp_path)
        if file_size == 0:
            return JSONResponse(status_code=400, content={"success": False, "message": "The dataset is empty."})

        temp_output = tempfile.mkdtemp()
        result = process_csv(temp_path, temp_output)

        if not result["success"]:
            shutil.rmtree(temp_output, ignore_errors=True)
            return JSONResponse(status_code=400, content=result)

        # Read all generated JSON files into memory
        session_data: dict[str, list | dict] = {}
        for fname in os.listdir(temp_output):
            fpath = os.path.join(temp_output, fname)
            with open(fpath, "r") as f:
                session_data[fname] = json.load(f)

        shutil.rmtree(temp_output, ignore_errors=True)

        # Store in session
        result["metadata"]["filename"] = file.filename
        _sessions[sid] = {
            "metadata": result["metadata"],
            "data": session_data,
        }

        return result

    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "message": f"Dataset processing failed: {str(e)}"})
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


@app.post("/api/reset")
async def reset_dataset(request: Request):
    sid = _get_session_id(request)
    if sid in _sessions:
        del _sessions[sid]
    return {"success": True, "message": "Dataset removed.", "has_dataset": False}


def _read_session_data(request: Request, filename: str):
    sid = _get_session_id(request)
    session = _sessions.get(sid)
    if not session or "data" not in session or filename not in session["data"]:
        raise HTTPException(status_code=404, detail={"success": False, "message": "No dataset available"})
    return session["data"][filename]


@app.get("/api/data/summary")
async def get_summary(request: Request):
    return _read_session_data(request, "summary.json")


@app.get("/api/data/category")
async def get_category(request: Request):
    return _read_session_data(request, "category.json")


@app.get("/api/data/region")
async def get_region(request: Request):
    return _read_session_data(request, "region.json")


@app.get("/api/data/payment")
async def get_payment(request: Request):
    return _read_session_data(request, "payment.json")


@app.get("/api/data/yearly")
async def get_yearly(request: Request):
    return _read_session_data(request, "yearly.json")


@app.get("/api/data/monthly")
async def get_monthly(request: Request):
    return _read_session_data(request, "monthly.json")


@app.get("/api/data/customers")
async def get_customers(request: Request):
    return _read_session_data(request, "customers.json")


@app.get("/api/data/operations")
async def get_operations(request: Request):
    return _read_session_data(request, "operations.json")


@app.get("/api/data/relationships")
async def get_relationships(request: Request):
    return _read_session_data(request, "relationships.json")


@app.get("/api/data/metadata")
async def get_metadata(request: Request):
    return _read_session_data(request, "metadata.json")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
