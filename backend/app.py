"""
E-Commerce Analytics Backend API
================================
A lightweight FastAPI server for dataset upload and processing.

Run:
    uvicorn backend.app:app --host 0.0.0.0 --port 8000

Environment variables:
    FRONTEND_URL  - Allowed CORS origin (default: http://localhost:3000)
    PORT          - Server port (default: 8000)
    DATA_DIR      - Runtime data directory (default: data/runtime)
"""

import os
import sys
import json
import shutil
import tempfile
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from python.process_dataset import process_csv, get_preview_data
import pandas as pd

app = FastAPI(
    title="E-Commerce Analytics API",
    description="API for uploading and processing e-commerce datasets",
    version="1.0.0",
)

# Environment-based CORS
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurable data directory
DATA_DIR = os.environ.get("DATA_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "runtime"))
METADATA_FILE = os.path.join(DATA_DIR, "metadata.json")

# Dashboard JSON file names
DASHBOARD_FILES = [
    "summary.json", "category.json", "region.json", "payment.json",
    "yearly.json", "monthly.json", "customers.json", "operations.json",
    "relationships.json",
]


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.get("/api/dataset")
async def get_dataset_info():
    """Get information about the currently loaded dataset."""
    if os.path.exists(METADATA_FILE):
        try:
            with open(METADATA_FILE, "r") as f:
                metadata = json.load(f)
            return {"success": True, "has_dataset": True, "metadata": metadata}
        except Exception:
            return {"success": True, "has_dataset": False, "metadata": None, "message": "Corrupted metadata"}
    return {"success": True, "has_dataset": False, "metadata": None, "message": "No dataset loaded"}


@app.post("/api/preview")
async def preview_dataset(file: UploadFile = File(...)):
    """Preview a CSV file without processing it."""
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
async def upload_dataset(file: UploadFile = File(...)):
    """Upload and process a CSV dataset with atomic replacement."""
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

        # Process to a temporary output directory first (atomic update)
        temp_output = tempfile.mkdtemp()
        result = process_csv(temp_path, temp_output)

        if not result["success"]:
            shutil.rmtree(temp_output, ignore_errors=True)
            return JSONResponse(status_code=400, content=result)

        # Only replace active data after successful processing
        os.makedirs(DATA_DIR, exist_ok=True)

        # Remove old dashboard files
        for fname in DASHBOARD_FILES + ["metadata.json"]:
            old_path = os.path.join(DATA_DIR, fname)
            if os.path.exists(old_path):
                os.remove(old_path)

        # Move new files into DATA_DIR
        for fname in os.listdir(temp_output):
            src = os.path.join(temp_output, fname)
            dst = os.path.join(DATA_DIR, fname)
            shutil.move(src, dst)

        shutil.rmtree(temp_output, ignore_errors=True)

        # Update metadata filename
        result["metadata"]["filename"] = file.filename

        return result

    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "message": f"Dataset processing failed: {str(e)}"})
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


@app.post("/api/reset")
async def reset_dataset():
    """Remove the active dataset and clear all generated JSON files."""
    try:
        all_files = DASHBOARD_FILES + ["metadata.json"]
        removed_count = 0
        for filename in all_files:
            filepath = os.path.join(DATA_DIR, filename)
            if os.path.exists(filepath):
                os.remove(filepath)
                removed_count += 1

        return {"success": True, "message": f"Dataset removed. {removed_count} files cleared.", "has_dataset": False}

    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "message": f"Reset failed: {str(e)}"})


def _read_json(filename: str):
    """Read a JSON file from DATA_DIR, returning 404 if not found."""
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail={"success": False, "message": "No dataset available"})
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except Exception:
        raise HTTPException(status_code=500, detail={"success": False, "message": "Error reading data file"})


@app.get("/api/data/summary")
async def get_summary():
    return _read_json("summary.json")


@app.get("/api/data/category")
async def get_category():
    return _read_json("category.json")


@app.get("/api/data/region")
async def get_region():
    return _read_json("region.json")


@app.get("/api/data/payment")
async def get_payment():
    return _read_json("payment.json")


@app.get("/api/data/yearly")
async def get_yearly():
    return _read_json("yearly.json")


@app.get("/api/data/monthly")
async def get_monthly():
    return _read_json("monthly.json")


@app.get("/api/data/customers")
async def get_customers():
    return _read_json("customers.json")


@app.get("/api/data/operations")
async def get_operations():
    return _read_json("operations.json")


@app.get("/api/data/relationships")
async def get_relationships():
    return _read_json("relationships.json")


@app.get("/api/data/metadata")
async def get_metadata():
    return _read_json("metadata.json")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
