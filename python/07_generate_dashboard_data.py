"""
Generate Dashboard Data
========================
Purpose: Export dashboard-ready JSON files from SQLite database.
These JSON files will be consumed by the future Next.js dashboard.
"""

import sqlite3
import pandas as pd
import json
import os
import numpy as np

print("=" * 60)
print("GENERATING DASHBOARD DATA")
print("=" * 60)

# ============================================
# 1. CONNECT TO DATABASE
# ============================================
DB_PATH = "database/ecommerce_sales.db"
conn = sqlite3.connect(DB_PATH)

# Load data into Pandas for easier transformations
df = pd.read_sql_query("SELECT * FROM sales", conn)

# Convert order_date to datetime
df["order_date"] = pd.to_datetime(df["order_date"], format="%m/%d/%Y")

# Extract year and month
df["year"] = df["order_date"].dt.year
df["month"] = df["order_date"].dt.month

print(f"Loaded {len(df)} rows from database")


# ============================================
# 2. CREATE WEB/DATA DIRECTORY
# ============================================
os.makedirs("web/data", exist_ok=True)


# ============================================
# 3. SUMMARY.JSON
# ============================================
print("\nGenerating summary.json...")

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
    "date_range_end": df["order_date"].max().strftime("%Y-%m-%d")
}

with open("web/data/summary.json", "w") as f:
    json.dump(summary, f, indent=2)

print(f"  Total Revenue: {summary['total_revenue']:,.2f}")
print(f"  Total Orders: {summary['total_orders']}")
print(f"  Unique Customers: {summary['unique_customers']}")


# ============================================
# 4. CATEGORY.JSON
# ============================================
print("\nGenerating category.json...")

category_df = df.groupby("product_category").agg(
    revenue=("revenue", "sum"),
    orders=("order_id", "count"),
    quantity=("quantity", "sum"),
    average_order_revenue=("revenue", "mean"),
    average_rating=("customer_rating", "mean"),
    average_discount=("discount", "mean"),
    average_delivery_days=("delivery_days", "mean")
).round(2).reset_index()

category_data = category_df.to_dict("records")

with open("web/data/category.json", "w") as f:
    json.dump(category_data, f, indent=2)

print(f"  Categories: {len(category_data)}")


# ============================================
# 5. REGION.JSON
# ============================================
print("\nGenerating region.json...")

region_df = df.groupby("region").agg(
    revenue=("revenue", "sum"),
    orders=("order_id", "count"),
    quantity=("quantity", "sum"),
    average_order_revenue=("revenue", "mean"),
    average_rating=("customer_rating", "mean"),
    average_delivery_days=("delivery_days", "mean")
).round(2).reset_index()

region_data = region_df.to_dict("records")

with open("web/data/region.json", "w") as f:
    json.dump(region_data, f, indent=2)

print(f"  Regions: {len(region_data)}")


# ============================================
# 6. PAYMENT.JSON
# ============================================
print("\nGenerating payment.json...")

total_orders = len(df)

payment_df = df.groupby("payment_method").agg(
    orders=("order_id", "count"),
    revenue=("revenue", "sum")
).reset_index()

payment_df["percentage_of_orders"] = round(payment_df["orders"] / total_orders * 100, 2)
payment_df["percentage_of_revenue"] = round(payment_df["revenue"] / df["revenue"].sum() * 100, 2)
payment_df["average_order_revenue"] = round(payment_df["revenue"] / payment_df["orders"], 2)

payment_data = payment_df.to_dict("records")

with open("web/data/payment.json", "w") as f:
    json.dump(payment_data, f, indent=2)

print(f"  Payment Methods: {len(payment_data)}")


# ============================================
# 7. YEARLY.JSON
# ============================================
print("\nGenerating yearly.json...")

yearly_df = df.groupby("year").agg(
    revenue=("revenue", "sum"),
    orders=("order_id", "count"),
    quantity=("quantity", "sum"),
    average_order_revenue=("revenue", "mean")
).round(2).reset_index()

yearly_df = yearly_df.sort_values("year")

yearly_data = yearly_df.to_dict("records")

with open("web/data/yearly.json", "w") as f:
    json.dump(yearly_data, f, indent=2)

print(f"  Years: {len(yearly_data)}")


# ============================================
# 8. MONTHLY.JSON
# ============================================
print("\nGenerating monthly.json...")

month_names = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
}

monthly_df = df.groupby("month").agg(
    revenue=("revenue", "sum"),
    orders=("order_id", "count"),
    quantity=("quantity", "sum"),
    average_order_revenue=("revenue", "mean")
).round(2).reset_index()

monthly_df = monthly_df.sort_values("month")
monthly_df["month_name"] = monthly_df["month"].map(month_names)

monthly_data = monthly_df.to_dict("records")

with open("web/data/monthly.json", "w") as f:
    json.dump(monthly_data, f, indent=2)

print(f"  Months: {len(monthly_data)}")


# ============================================
# 9. CUSTOMERS.JSON
# ============================================
print("\nGenerating customers.json...")

customer_df = df.groupby("customer_id").agg(
    total_orders=("order_id", "count"),
    total_revenue=("revenue", "sum"),
    total_quantity=("quantity", "sum"),
    average_order_revenue=("revenue", "mean"),
    average_rating=("customer_rating", "mean"),
    average_delivery_days=("delivery_days", "mean")
).round(2).reset_index()

customer_df = customer_df.sort_values("total_revenue", ascending=False)

customer_data = customer_df.to_dict("records")

with open("web/data/customers.json", "w") as f:
    json.dump(customer_data, f, indent=2)

print(f"  Customers: {len(customer_data)}")


# ============================================
# 10. OPERATIONS.JSON
# ============================================
print("\nGenerating operations.json...")

# Delivery days distribution
delivery_dist = df["delivery_days"].value_counts().sort_index()
delivery_distribution = [{"days": int(k), "count": int(v)} for k, v in delivery_dist.items()]

# Average delivery days by region
delivery_by_region = df.groupby("region")["delivery_days"].mean().round(2)
delivery_region = [{"region": k, "average_delivery_days": float(v)} for k, v in delivery_by_region.items()]

# Average delivery days by category
delivery_by_category = df.groupby("product_category")["delivery_days"].mean().round(2)
delivery_category = [{"category": k, "average_delivery_days": float(v)} for k, v in delivery_by_category.items()]

# Rating distribution
rating_dist = df["customer_rating"].value_counts().sort_index()
rating_distribution = [{"rating": float(k), "count": int(v)} for k, v in rating_dist.items()]

# Average rating by category
rating_by_category = df.groupby("product_category")["customer_rating"].mean().round(2)
rating_category = [{"category": k, "average_rating": float(v)} for k, v in rating_by_category.items()]

# Average rating by region
rating_by_region = df.groupby("region")["customer_rating"].mean().round(2)
rating_region = [{"region": k, "average_rating": float(v)} for k, v in rating_by_region.items()]

operations = {
    "delivery_distribution": delivery_distribution,
    "delivery_by_region": delivery_region,
    "delivery_by_category": delivery_category,
    "rating_distribution": rating_distribution,
    "rating_by_category": rating_category,
    "rating_by_region": rating_region
}

with open("web/data/operations.json", "w") as f:
    json.dump(operations, f, indent=2)

print(f"  Operations data generated")


# ============================================
# 11. RELATIONSHIPS.JSON
# ============================================
print("\nGenerating relationships.json...")

# Quantity vs Revenue (sample for scatter plot)
quantity_revenue = df[["quantity", "revenue"]].to_dict("records")

# Discount vs Revenue (sample for scatter plot)
discount_revenue = df[["discount", "revenue"]].to_dict("records")

# Delivery Days vs Customer Rating (sample for scatter plot)
delivery_rating = df[["delivery_days", "customer_rating"]].to_dict("records")

# Calculate correlation coefficients
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
        "delivery_rating_correlation": delivery_rating_corr
    }
}

with open("web/data/relationships.json", "w") as f:
    json.dump(relationships, f, indent=2)

print(f"  Relationships data generated")
print(f"  Correlations:")
print(f"    Quantity-Revenue: {quantity_revenue_corr}")
print(f"    Discount-Revenue: {discount_revenue_corr}")
print(f"    Delivery-Rating: {delivery_rating_corr}")


# ============================================
# 12. DATA VALIDATION
# ============================================
print("\n" + "=" * 60)
print("DASHBOARD DATA VALIDATION")
print("=" * 60)

validation_results = []

# Load all JSON files and validate
json_files = [
    "summary.json", "category.json", "region.json", "payment.json",
    "yearly.json", "monthly.json", "customers.json", "operations.json",
    "relationships.json"
]

all_json_valid = True
for filename in json_files:
    filepath = f"web/data/{filename}"
    try:
        with open(filepath, "r") as f:
            data = json.load(f)
        if not data:
            print(f"  {filename}: FAIL (empty)")
            all_json_valid = False
        else:
            print(f"  {filename}: PASS")
    except Exception as e:
        print(f"  {filename}: FAIL ({e})")
        all_json_valid = False

# Validate revenue consistency
sqlite_revenue = round(float(df["revenue"].sum()), 2)
category_revenue = round(sum(c["revenue"] for c in category_data), 2)
region_revenue = round(sum(r["revenue"] for r in region_data), 2)
payment_revenue = round(sum(p["revenue"] for p in payment_data), 2)
yearly_revenue = round(sum(y["revenue"] for y in yearly_data), 2)

tolerance = 0.01

def check_revenue(name, actual, expected):
    if abs(actual - expected) < tolerance:
        return "PASS"
    return f"FAIL (expected {expected:,.2f}, got {actual:,.2f})"

print("\nRevenue Validation:")
print(f"  Total Revenue: {summary['total_revenue']:,.2f}")
print(f"  Category totals: {check_revenue('Category', category_revenue, sqlite_revenue)}")
print(f"  Region totals: {check_revenue('Region', region_revenue, sqlite_revenue)}")
print(f"  Payment totals: {check_revenue('Payment', payment_revenue, sqlite_revenue)}")
print(f"  Yearly totals: {check_revenue('Yearly', yearly_revenue, sqlite_revenue)}")

print("\nOther Validation:")
print(f"  Total Orders: {summary['total_orders']}")
print(f"  Unique Customers: {summary['unique_customers']}")
print(f"  JSON Integrity: {'PASS' if all_json_valid else 'FAIL'}")


# ============================================
# 13. CLOSE CONNECTION
# ============================================
conn.close()

print("\n" + "=" * 60)
print("DASHBOARD DATA GENERATION COMPLETE")
print("=" * 60)

print(f"\nFiles created in web/data/:")
for filename in json_files:
    print(f"  - {filename}")
