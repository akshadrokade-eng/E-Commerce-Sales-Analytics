"""
Process Dataset
===============
Reusable pipeline to process an e-commerce CSV dataset and generate dashboard JSON files.

Usage:
    python process_dataset.py "path/to/dataset.csv"

Output:
    web/public/data/*.json
    web/public/data/metadata.json
"""

import pandas as pd
import json
import os
import sys
import numpy as np
from datetime import datetime

# Canonical required columns
REQUIRED_COLUMNS = [
    "order_id",
    "order_date",
    "customer_id",
    "product_category",
    "region",
    "quantity",
    "unit_price",
    "discount",
    "payment_method",
    "delivery_days",
    "customer_rating",
    "revenue",
]

# Month names for monthly aggregation
MONTH_NAMES = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
}


def normalize_column_name(col: str) -> str:
    """Normalize column name: lowercase, strip whitespace, replace spaces with underscores."""
    return col.strip().lower().replace(" ", "_")


def validate_dataset(df: pd.DataFrame) -> dict:
    """
    Validate the dataset schema and data quality.
    
    Returns:
        dict with keys: valid (bool), missing_columns (list), errors (list)
    """
    result = {"valid": True, "missing_columns": [], "errors": []}
    
    # Check if empty
    if len(df) == 0:
        result["valid"] = False
        result["errors"].append("The dataset is empty.")
        return result
    
    # Check required columns
    normalized_columns = {normalize_column_name(col): col for col in df.columns}
    missing = []
    for req_col in REQUIRED_COLUMNS:
        if req_col not in normalized_columns:
            missing.append(req_col)
    
    if missing:
        result["valid"] = False
        result["missing_columns"] = missing
        result["errors"].append(f"Dataset is missing required columns: {', '.join(missing)}")
        return result
    
    # Rename columns to canonical names
    rename_map = {normalized_columns[k]: k for k in REQUIRED_COLUMNS if k in normalized_columns}
    df.rename(columns=rename_map, inplace=True)
    
    # Validate numeric fields
    numeric_fields = ["quantity", "unit_price", "discount", "delivery_days", "customer_rating", "revenue"]
    for field in numeric_fields:
        if not pd.to_numeric(df[field], errors="coerce").notna().all():
            result["valid"] = False
            result["errors"].append(f"Some values in '{field}' are not valid numbers.")
    
    # Validate date field
    try:
        pd.to_datetime(df["order_date"], errors="raise")
    except Exception:
        result["valid"] = False
        result["errors"].append("Some order dates could not be parsed.")
    
    # Validate ranges
    if result["valid"]:
        if (df["quantity"] < 0).any():
            result["errors"].append("Quantity contains negative values.")
            result["valid"] = False
        
        if (df["unit_price"] < 0).any():
            result["errors"].append("Unit price contains negative values.")
            result["valid"] = False
        
        if (df["discount"] < 0).any() or (df["discount"] > 1).any():
            result["errors"].append("Discount values must be between 0 and 1.")
            result["valid"] = False
        
        if (df["delivery_days"] < 0).any():
            result["errors"].append("Delivery days contains negative values.")
            result["valid"] = False
        
        if (df["customer_rating"] < 0).any() or (df["customer_rating"] > 5).any():
            result["errors"].append("Customer rating must be between 0 and 5.")
            result["valid"] = False
        
        if (df["revenue"] < 0).any():
            result["errors"].append("Revenue contains negative values.")
            result["valid"] = False
    
    return result


def generate_dashboard_json(df: pd.DataFrame, output_dir: str) -> dict:
    """
    Generate all dashboard JSON files from a validated DataFrame.
    
    Returns:
        dict with metadata about the generated data
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Ensure order_date is datetime
    df["order_date"] = pd.to_datetime(df["order_date"])
    df["year"] = df["order_date"].dt.year
    df["month"] = df["order_date"].dt.month
    
    # 1. Summary
    summary = {
        "total_revenue": round(float(df["revenue"].sum()), 2),
        "total_orders": int(len(df)),
        "unique_customers": int(df["customer_id"].nunique()),
        "average_order_revenue": round(float(df["revenue"].mean()), 2),
        "total_quantity": int(df["quantity"].sum()),
        "average_quantity": round(float(df["quantity"].mean()), 2),
        "average_delivery_days": round(float(df["delivery_days"].mean()), 2),
        "average_customer_rating": round(float(df["customer_rating"].mean()), 2),
        "average_discount": round(float(df["discount"].mean()), 4),
        "date_range_start": df["order_date"].min().strftime("%Y-%m-%d"),
        "date_range_end": df["order_date"].max().strftime("%Y-%m-%d"),
    }
    
    with open(os.path.join(output_dir, "summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
    
    # 2. Category
    category_df = df.groupby("product_category").agg(
        revenue=("revenue", "sum"),
        orders=("order_id", "count"),
        quantity=("quantity", "sum"),
        average_order_revenue=("revenue", "mean"),
        average_rating=("customer_rating", "mean"),
        average_discount=("discount", "mean"),
        average_delivery_days=("delivery_days", "mean"),
    ).round(2).reset_index()
    
    with open(os.path.join(output_dir, "category.json"), "w") as f:
        json.dump(category_df.to_dict("records"), f, indent=2)
    
    # 3. Region
    region_df = df.groupby("region").agg(
        revenue=("revenue", "sum"),
        orders=("order_id", "count"),
        quantity=("quantity", "sum"),
        average_order_revenue=("revenue", "mean"),
        average_rating=("customer_rating", "mean"),
        average_delivery_days=("delivery_days", "mean"),
    ).round(2).reset_index()
    
    with open(os.path.join(output_dir, "region.json"), "w") as f:
        json.dump(region_df.to_dict("records"), f, indent=2)
    
    # 4. Payment
    total_orders = len(df)
    payment_df = df.groupby("payment_method").agg(
        orders=("order_id", "count"),
        revenue=("revenue", "sum"),
    ).reset_index()
    payment_df["percentage_of_orders"] = round(payment_df["orders"] / total_orders * 100, 2)
    payment_df["percentage_of_revenue"] = round(payment_df["revenue"] / df["revenue"].sum() * 100, 2)
    payment_df["average_order_revenue"] = round(payment_df["revenue"] / payment_df["orders"], 2)
    
    with open(os.path.join(output_dir, "payment.json"), "w") as f:
        json.dump(payment_df.to_dict("records"), f, indent=2)
    
    # 5. Yearly
    yearly_df = df.groupby("year").agg(
        revenue=("revenue", "sum"),
        orders=("order_id", "count"),
        quantity=("quantity", "sum"),
        average_order_revenue=("revenue", "mean"),
    ).round(2).reset_index()
    yearly_df = yearly_df.sort_values("year")
    
    with open(os.path.join(output_dir, "yearly.json"), "w") as f:
        json.dump(yearly_df.to_dict("records"), f, indent=2)
    
    # 6. Monthly
    monthly_df = df.groupby("month").agg(
        revenue=("revenue", "sum"),
        orders=("order_id", "count"),
        quantity=("quantity", "sum"),
        average_order_revenue=("revenue", "mean"),
    ).round(2).reset_index()
    monthly_df = monthly_df.sort_values("month")
    monthly_df["month_name"] = monthly_df["month"].map(MONTH_NAMES)
    
    with open(os.path.join(output_dir, "monthly.json"), "w") as f:
        json.dump(monthly_df.to_dict("records"), f, indent=2)
    
    # 7. Customers
    customer_df = df.groupby("customer_id").agg(
        total_orders=("order_id", "count"),
        total_revenue=("revenue", "sum"),
        total_quantity=("quantity", "sum"),
        average_order_revenue=("revenue", "mean"),
        average_rating=("customer_rating", "mean"),
        average_delivery_days=("delivery_days", "mean"),
    ).round(2).reset_index()
    customer_df = customer_df.sort_values("total_revenue", ascending=False)
    
    with open(os.path.join(output_dir, "customers.json"), "w") as f:
        json.dump(customer_df.to_dict("records"), f, indent=2)
    
    # 8. Operations
    delivery_dist = df["delivery_days"].value_counts().sort_index()
    delivery_distribution = [{"days": int(k), "count": int(v)} for k, v in delivery_dist.items()]
    
    delivery_by_region = df.groupby("region")["delivery_days"].mean().round(2)
    delivery_region = [{"region": k, "average_delivery_days": float(v)} for k, v in delivery_by_region.items()]
    
    delivery_by_category = df.groupby("product_category")["delivery_days"].mean().round(2)
    delivery_category = [{"category": k, "average_delivery_days": float(v)} for k, v in delivery_by_category.items()]
    
    rating_dist = df["customer_rating"].value_counts().sort_index()
    rating_distribution = [{"rating": float(k), "count": int(v)} for k, v in rating_dist.items()]
    
    rating_by_category = df.groupby("product_category")["customer_rating"].mean().round(2)
    rating_category = [{"category": k, "average_rating": float(v)} for k, v in rating_by_category.items()]
    
    rating_by_region = df.groupby("region")["customer_rating"].mean().round(2)
    rating_region = [{"region": k, "average_rating": float(v)} for k, v in rating_by_region.items()]
    
    operations = {
        "delivery_distribution": delivery_distribution,
        "delivery_by_region": delivery_region,
        "delivery_by_category": delivery_category,
        "rating_distribution": rating_distribution,
        "rating_by_category": rating_category,
        "rating_by_region": rating_region,
    }
    
    with open(os.path.join(output_dir, "operations.json"), "w") as f:
        json.dump(operations, f, indent=2)
    
    # 9. Relationships
    quantity_revenue = df[["quantity", "revenue"]].to_dict("records")
    discount_revenue = df[["discount", "revenue"]].to_dict("records")
    delivery_rating = df[["delivery_days", "customer_rating"]].to_dict("records")
    
    quantity_revenue_corr = round(float(df["quantity"].corr(df["revenue"])), 4)
    discount_revenue_corr = round(float(df["discount"].corr(df["revenue"])), 4)
    delivery_rating_corr = round(float(df["delivery_days"].corr(df["customer_rating"])), 4)
    
    relationships = {
        "quantity_vs_revenue": quantity_revenue,
        "discount_vs_revenue": discount_revenue,
        "delivery_days_vs_rating": delivery_rating,
        "correlations": {
            "quantity_revenue_correlation": quantity_revenue_corr,
            "discount_revenue_correlation": discount_revenue_corr,
            "delivery_rating_correlation": delivery_rating_corr,
        },
    }
    
    with open(os.path.join(output_dir, "relationships.json"), "w") as f:
        json.dump(relationships, f, indent=2)
    
    # Generate metadata
    metadata = {
        "filename": "uploaded_dataset.csv",
        "rows": len(df),
        "columns": len(df.columns),
        "date_min": df["order_date"].min().strftime("%Y-%m-%d"),
        "date_max": df["order_date"].max().strftime("%Y-%m-%d"),
        "last_updated": datetime.now().isoformat(),
        "unique_customers": int(df["customer_id"].nunique()),
        "unique_categories": int(df["product_category"].nunique()),
        "unique_regions": int(df["region"].nunique()),
    }
    
    with open(os.path.join(output_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
    
    return metadata


def get_preview_data(df: pd.DataFrame, num_rows: int = 5) -> dict:
    """Get preview data for the dataset."""
    return {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "preview": df.head(num_rows).to_dict("records"),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
    }


def process_csv(csv_path: str, output_dir: str = None) -> dict:
    """
    Main processing function.
    
    Args:
        csv_path: Path to the CSV file
        output_dir: Output directory for JSON files (default: web/public/data)
    
    Returns:
        dict with success status, metadata, and any errors
    """
    if output_dir is None:
        # Default to project root relative path
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)
        output_dir = os.path.join(project_root, "web", "public", "data")
    
    result = {
        "success": False,
        "filename": os.path.basename(csv_path),
        "rows": 0,
        "columns": 0,
        "message": "",
        "metadata": None,
        "preview": None,
        "missing_columns": [],
    }
    
    try:
        # Load CSV
        df = pd.read_csv(csv_path)
        
        # Get preview before validation
        result["preview"] = get_preview_data(df)
        result["rows"] = len(df)
        result["columns"] = len(df.columns)
        
        # Normalize column names
        df.columns = [normalize_column_name(col) for col in df.columns]
        
        # Validate
        validation = validate_dataset(df)
        
        if not validation["valid"]:
            result["message"] = validation["errors"][0] if validation["errors"] else "Validation failed"
            result["missing_columns"] = validation["missing_columns"]
            return result
        
        # Generate dashboard JSON
        metadata = generate_dashboard_json(df, output_dir)
        metadata["filename"] = os.path.basename(csv_path)
        
        result["success"] = True
        result["metadata"] = metadata
        result["message"] = f"Successfully processed {len(df)} rows"
        
    except Exception as e:
        result["message"] = f"Error processing dataset: {str(e)}"
    
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_dataset.py <path_to_csv>")
        sys.exit(1)
    
    csv_path = sys.argv[1]
    
    if not os.path.exists(csv_path):
        print(f"Error: File not found: {csv_path}")
        sys.exit(1)
    
    result = process_csv(csv_path)
    
    print(json.dumps(result, indent=2))
    
    if result["success"]:
        print("\n[OK] Dashboard data generated successfully!")
    else:
        print(f"\n[ERROR] {result['message']}")
        sys.exit(1)
