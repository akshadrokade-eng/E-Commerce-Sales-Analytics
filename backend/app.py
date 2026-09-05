"""
E-Commerce Analytics Backend API
================================
A lightweight FastAPI server for dataset upload and processing.

Run:
    cd backend
    uvicorn app:app --host 127.0.0.1 --port 8000
"""

import os
import sys
import json
import shutil
import tempfile
from datetime import datetime
from typing import Optional

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

# CORS for Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "web", "public", "data")
METADATA_FILE = os.path.join(OUTPUT_DIR, "metadata.json")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.get("/api/dataset")
async def get_dataset_info():
    """Get information about the currently loaded dataset."""
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, "r") as f:
            metadata = json.load(f)
        return {"success": True, "has_dataset": True, "metadata": metadata}
    return {"success": True, "has_dataset": False, "metadata": None, "message": "No dataset loaded"}


@app.post("/api/preview")
async def preview_dataset(file: UploadFile = File(...)):
    """
    Preview a CSV file without processing it.
    Returns column info and first 5 rows.
    """
    # Validate file extension
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail={"success": False, "message": "Please select a CSV file."},
        )
    
    # Save to temporary file
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Read and preview
        df = pd.read_csv(temp_path)
        df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
        
        preview = get_preview_data(df, num_rows=5)
        preview["filename"] = file.filename
        preview["file_size"] = os.path.getsize(temp_path)
        
        return {"success": True, "preview": preview}
    
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "message": f"Error reading CSV: {str(e)}"},
        )
    finally:
        # Clean up
        shutil.rmtree(temp_dir, ignore_errors=True)


@app.post("/api/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload and process a CSV dataset.
    
    Returns:
        success: bool
        filename: str
        rows: int
        columns: int
        message: str
        metadata: dict (if successful)
    """
    # Validate file extension
    if not file.filename.lower().endswith(".csv"):
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Please select a CSV file.",
            },
        )
    
    # Save to temporary file
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, file.filename)
    
    try:
        # Save uploaded file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Check file size
        file_size = os.path.getsize(temp_path)
        if file_size == 0:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "The dataset is empty."},
            )
        
        # Process the dataset
        result = process_csv(temp_path, OUTPUT_DIR)
        
        if result["success"]:
            # Update metadata filename
            result["metadata"]["filename"] = file.filename
        
        return result
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": f"Dataset processing failed: {str(e)}",
            },
        )
    finally:
        # Clean up temporary files
        shutil.rmtree(temp_dir, ignore_errors=True)


@app.post("/api/reset")
async def reset_dataset():
    """
    Remove the active dataset and clear all generated JSON files.
    Returns the application to the empty state.
    """
    try:
        # List of JSON files generated by the pipeline
        json_files = [
            "summary.json", "category.json", "region.json", "payment.json",
            "yearly.json", "monthly.json", "customers.json", "operations.json",
            "relationships.json", "metadata.json",
        ]
        
        removed_count = 0
        for filename in json_files:
            filepath = os.path.join(OUTPUT_DIR, filename)
            if os.path.exists(filepath):
                os.remove(filepath)
                removed_count += 1
        
        return {
            "success": True,
            "message": f"Dataset removed. {removed_count} files cleared.",
            "has_dataset": False,
        }
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Reset failed: {str(e)}"},
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
