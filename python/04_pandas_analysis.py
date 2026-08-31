"""
Python and Pandas Business Analysis
=====================================
Purpose: Demonstrate Python/Pandas data analysis on e-commerce data.
This script loads data from SQLite and performs analysis using Pandas.
"""

import sqlite3
import pandas as pd
import os

# ============================================
# 1. LOAD DATA FROM SQLITE
# ============================================
print("=" * 60)
print("LOADING DATA FROM SQLITE DATABASE")
print("=" * 60)

# Connect to SQLite database
DB_PATH = "database/ecommerce_sales.db"
conn = sqlite3.connect(DB_PATH)

# Load entire sales table into a Pandas DataFrame
# This is the starting point for all Pandas analysis
df = pd.read_sql_query("SELECT * FROM sales", conn)
conn.close()

print(f"Loaded {len(df)} rows and {len(df.columns)} columns")


# ============================================
# 2. INITIAL DATA INSPECTION
# ============================================
print("\n" + "=" * 60)
print("INITIAL DATA INSPECTION")
print("=" * 60)

# 2.1 DataFrame Shape
print("\n--- 2.1 DataFrame Shape ---")
print(f"Rows: {df.shape[0]}")
print(f"Columns: {df.shape[1]}")

# 2.2 Data Types
print("\n--- 2.2 Data Types ---")
print(df.dtypes)

# 2.3 Missing Values
print("\n--- 2.3 Missing Values ---")
print(df.isnull().sum())

# 2.4 Duplicate Rows
print("\n--- 2.4 Duplicate Rows ---")
duplicate_count = df.duplicated().sum()
print(f"Number of duplicate rows: {duplicate_count}")

# 2.5 Basic Statistics
print("\n--- 2.5 Basic Statistics ---")
print(df.describe())


# ============================================
# 3. DATA CONVERSION
# ============================================
print("\n" + "=" * 60)
print("DATA CONVERSION")
print("=" * 60)

# Convert order_date from string to datetime
# Date format in data is M/D/YYYY (e.g., "1/1/2022")
df["order_date"] = pd.to_datetime(df["order_date"], format="%m/%d/%Y")

# Extract Year and Month for time analysis
df["year"] = df["order_date"].dt.year
df["month"] = df["order_date"].dt.month

print("Converted order_date to datetime")
print("Created 'year' and 'month' columns")
print(f"Date range: {df['order_date'].min()} to {df['order_date'].max()}")


# ============================================
# SECTION 1 — Overall Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 1 — OVERALL ANALYSIS")
print("=" * 60)

total_revenue = df["revenue"].sum()
total_orders = len(df)
avg_revenue_per_order = df["revenue"].mean()
total_quantity = df["quantity"].sum()
avg_quantity_per_order = df["quantity"].mean()
unique_customers = df["customer_id"].nunique()

print(f"\nTotal Revenue:           {total_revenue:,.2f}")
print(f"Total Orders:            {total_orders}")
print(f"Average Revenue/Order:   {avg_revenue_per_order:,.2f}")
print(f"Total Quantity Sold:     {total_quantity}")
print(f"Average Quantity/Order:  {avg_quantity_per_order:,.2f}")
print(f"Unique Customers:        {unique_customers}")


# ============================================
# SECTION 2 — Category Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 2 — CATEGORY ANALYSIS")
print("=" * 60)

# Group by product_category and calculate aggregates
category_analysis = df.groupby("product_category").agg(
    Total_Revenue=("revenue", "sum"),
    Total_Quantity=("quantity", "sum"),
    Avg_Unit_Price=("unit_price", "mean"),
    Avg_Discount=("discount", "mean"),
    Avg_Customer_Rating=("customer_rating", "mean"),
    Order_Count=("order_id", "count")
).round(2)

# Sort by Total_Revenue in descending order
category_analysis = category_analysis.sort_values("Total_Revenue", ascending=False)

print("\n--- Revenue by Category ---")
print(category_analysis[["Total_Revenue", "Order_Count"]])

print("\n--- Quantity by Category ---")
print(category_analysis[["Total_Quantity"]])

print("\n--- Average Metrics by Category ---")
print(category_analysis[["Avg_Unit_Price", "Avg_Discount", "Avg_Customer_Rating"]])


# ============================================
# SECTION 3 — Regional Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 3 — REGIONAL ANALYSIS")
print("=" * 60)

# Group by region and calculate aggregates
region_analysis = df.groupby("region").agg(
    Total_Revenue=("revenue", "sum"),
    Total_Quantity=("quantity", "sum"),
    Order_Count=("order_id", "count"),
    Avg_Delivery_Days=("delivery_days", "mean"),
    Avg_Customer_Rating=("customer_rating", "mean")
).round(2)

# Sort by Total_Revenue in descending order
region_analysis = region_analysis.sort_values("Total_Revenue", ascending=False)

print("\n--- Revenue by Region ---")
print(region_analysis[["Total_Revenue", "Order_Count"]])

print("\n--- Quantity and Delivery by Region ---")
print(region_analysis[["Total_Quantity", "Avg_Delivery_Days", "Avg_Customer_Rating"]])


# ============================================
# SECTION 4 — Payment Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 4 — PAYMENT ANALYSIS")
print("=" * 60)

# Group by payment_method and calculate aggregates
payment_analysis = df.groupby("payment_method").agg(
    Order_Count=("order_id", "count"),
    Total_Revenue=("revenue", "sum"),
    Avg_Revenue_Per_Order=("revenue", "mean")
).round(2)

# Sort by Order_Count in descending order
payment_analysis = payment_analysis.sort_values("Order_Count", ascending=False)

print("\n--- Payment Method Analysis ---")
print(payment_analysis)


# ============================================
# SECTION 5 — Customer Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 5 — CUSTOMER ANALYSIS")
print("=" * 60)

# Group by customer_id and calculate aggregates
customer_analysis = df.groupby("customer_id").agg(
    Order_Count=("order_id", "count"),
    Total_Revenue=("revenue", "sum"),
    Avg_Order_Value=("revenue", "mean")
).round(2)

# Sort by Total_Revenue in descending order
customer_analysis = customer_analysis.sort_values("Total_Revenue", ascending=False)

print("\n--- Orders per Customer (Top 10) ---")
print(customer_analysis[["Order_Count"]].head(10))

print("\n--- Revenue per Customer (Top 10) ---")
print(customer_analysis[["Total_Revenue", "Order_Count"]].head(10))

# Calculate customer statistics
customers_with_multiple_orders = (customer_analysis["Order_Count"] > 1).sum()
customers_with_single_order = (customer_analysis["Order_Count"] == 1).sum()

print(f"\nCustomers with multiple orders: {customers_with_multiple_orders}")
print(f"Customers with single order: {customers_with_single_order}")


# ============================================
# SECTION 6 — Delivery Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 6 — DELIVERY ANALYSIS")
print("=" * 60)

avg_delivery = df["delivery_days"].mean()
min_delivery = df["delivery_days"].min()
max_delivery = df["delivery_days"].max()

print(f"\nAverage Delivery Days: {avg_delivery:,.2f}")
print(f"Minimum Delivery Days: {min_delivery}")
print(f"Maximum Delivery Days: {max_delivery}")

# Average delivery days by region
delivery_by_region = df.groupby("region")["delivery_days"].mean().round(2)
delivery_by_region = delivery_by_region.sort_values()

print("\n--- Average Delivery Days by Region ---")
print(delivery_by_region)


# ============================================
# SECTION 7 — Discount Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 7 — DISCOUNT ANALYSIS")
print("=" * 60)

avg_discount = df["discount"].mean()
min_discount = df["discount"].min()
max_discount = df["discount"].max()

print(f"\nAverage Discount: {avg_discount:.4f}")
print(f"Minimum Discount: {min_discount}")
print(f"Maximum Discount: {max_discount}")

# Revenue by discount level (rounded to 2 decimal places)
df["discount_level"] = df["discount"].round(2)
discount_analysis = df.groupby("discount_level").agg(
    Order_Count=("order_id", "count"),
    Total_Revenue=("revenue", "sum"),
    Avg_Revenue=("revenue", "mean")
).round(2)

print("\n--- Revenue by Discount Level ---")
print(discount_analysis)


# ============================================
# SECTION 8 — Time Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 8 — TIME ANALYSIS")
print("=" * 60)

# Revenue by Year
yearly_analysis = df.groupby("year").agg(
    Total_Revenue=("revenue", "sum"),
    Order_Count=("order_id", "count")
).round(2)

print("\n--- Revenue by Year ---")
print(yearly_analysis)

# Revenue by Month
monthly_analysis = df.groupby("month").agg(
    Total_Revenue=("revenue", "sum"),
    Order_Count=("order_id", "count")
).round(2)

print("\n--- Revenue by Month ---")
print(monthly_analysis)


# ============================================
# SECTION 9 — Data Validation
# ============================================
print("\n" + "=" * 60)
print("SECTION 9 — DATA VALIDATION")
print("=" * 60)

# Calculate expected revenue using the formula:
# expected = quantity * unit_price * (1 - discount)
df["expected_revenue"] = df["quantity"] * df["unit_price"] * (1 - df["discount"])

# Calculate difference between actual and expected
df["revenue_diff"] = abs(df["revenue"] - df["expected_revenue"])

# Find the maximum difference
max_diff = df["revenue_diff"].max()
mean_diff = df["revenue_diff"].mean()

print(f"\nMaximum Revenue Difference: {max_diff:.4f}")
print(f"Mean Revenue Difference:    {mean_diff:.4f}")

# Check if differences are significant (more than 0.01)
significant_diffs = (df["revenue_diff"] > 0.01).sum()
print(f"Rows with significant difference (>0.01): {significant_diffs}")


# ============================================
# 4. SAVE RESULTS TO CSV
# ============================================
print("\n" + "=" * 60)
print("SAVING RESULTS TO CSV")
print("=" * 60)

# Create outputs directory if it doesn't exist
os.makedirs("outputs", exist_ok=True)

# Save category analysis
category_analysis.to_csv("outputs/category_analysis.csv")
print("Saved: outputs/category_analysis.csv")

# Save region analysis
region_analysis.to_csv("outputs/region_analysis.csv")
print("Saved: outputs/region_analysis.csv")

# Save payment analysis
payment_analysis.to_csv("outputs/payment_analysis.csv")
print("Saved: outputs/payment_analysis.csv")

# Save customer analysis (top 50 customers)
customer_analysis.head(50).to_csv("outputs/customer_analysis.csv")
print("Saved: outputs/customer_analysis.csv")

# Save yearly analysis
yearly_analysis.to_csv("outputs/yearly_sales.csv")
print("Saved: outputs/yearly_sales.csv")

# Save monthly analysis
monthly_analysis.to_csv("outputs/monthly_sales.csv")
print("Saved: outputs/monthly_sales.csv")


# ============================================
# 5. SUMMARY
# ============================================
print("\n" + "=" * 60)
print("PANDAS ANALYSIS COMPLETE")
print("=" * 60)
