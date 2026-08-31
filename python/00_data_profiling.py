"""
Data Profiling Script for E-Commerce Dataset
=============================================
Purpose: Understand the dataset BEFORE doing any analysis.
This script reads the CSV and prints useful information.
It does NOT modify the original data.
"""

import pandas as pd

# ============================================
# 1. LOAD THE DATASET
# ============================================
# Read the CSV file into a Pandas DataFrame
# The file is in data/raw/ folder
df = pd.read_csv("data/raw/ecommerce_sales_analytics_5000.csv")

print("=" * 60)
print("E-COMMERCE DATASET PROFILING REPORT")
print("=" * 60)

# ============================================
# 2. BASIC SHAPE
# ============================================
print("\n--- 1. NUMBER OF ROWS AND COLUMNS ---")
print(f"Rows:    {df.shape[0]}")
print(f"Columns: {df.shape[1]}")

# ============================================
# 3. COLUMN NAMES AND DATA TYPES
# ============================================
print("\n--- 2. COLUMN NAMES AND DATA TYPES ---")
print(df.dtypes)

# ============================================
# 4. FIRST 5 ROWS (SAMPLE)
# ============================================
print("\n--- 3. FIRST 5 ROWS ---")
print(df.head())

# ============================================
# 5. MISSING VALUES
# ============================================
print("\n--- 4. MISSING VALUES ---")
missing = df.isnull().sum()
print(missing)

# ============================================
# 6. DUPLICATE ROWS
# ============================================
print("\n--- 5. DUPLICATE ROWS ---")
duplicate_count = df.duplicated().sum()
print(f"Number of duplicate rows: {duplicate_count}")

# ============================================
# 7. UNIQUE VALUES FOR CATEGORICAL COLUMNS
# ============================================
print("\n--- 6. UNIQUE VALUES FOR CATEGORICAL COLUMNS ---")
categorical_cols = ["product_category", "region", "payment_method"]
for col in categorical_cols:
    print(f"\n{col}: {df[col].nunique()} unique values")
    print(df[col].value_counts())

# ============================================
# 8. BASIC STATISTICS FOR NUMERICAL COLUMNS
# ============================================
print("\n--- 7. BASIC STATISTICS FOR NUMERICAL COLUMNS ---")
print(df.describe())

# ============================================
# 9. DATE RANGE
# ============================================
print("\n--- 8. DATE RANGE ---")
# Convert order_date to datetime format
df["order_date"] = pd.to_datetime(df["order_date"])
print(f"Minimum date: {df['order_date'].min()}")
print(f"Maximum date: {df['order_date'].max()}")

# ============================================
# 10. UNIQUE CUSTOMERS
# ============================================
print("\n--- 9. UNIQUE CUSTOMERS ---")
print(f"Number of unique customers: {df['customer_id'].nunique()}")

# ============================================
# 11. UNIQUE ORDERS
# ============================================
print("\n--- 10. UNIQUE ORDERS ---")
print(f"Number of unique orders: {df['order_id'].nunique()}")

# ============================================
# 12. REVENUE STATISTICS
# ============================================
print("\n--- 11. REVENUE STATISTICS ---")
print(f"Total Revenue:   {df['revenue'].sum():,.2f}")
print(f"Mean Revenue:    {df['revenue'].mean():,.2f}")
print(f"Median Revenue:  {df['revenue'].median():,.2f}")
print(f"Min Revenue:     {df['revenue'].min():,.2f}")
print(f"Max Revenue:     {df['revenue'].max():,.2f}")
print(f"Std Dev Revenue: {df['revenue'].std():,.2f}")

# ============================================
# 13. QUANTITY STATISTICS
# ============================================
print("\n--- 12. QUANTITY STATISTICS ---")
print(f"Mean Quantity:   {df['quantity'].mean():,.2f}")
print(f"Median Quantity: {df['quantity'].median():,.2f}")
print(f"Min Quantity:    {df['quantity'].min()}")
print(f"Max Quantity:    {df['quantity'].max()}")

# ============================================
# 14. DISCOUNT STATISTICS
# ============================================
print("\n--- 13. DISCOUNT STATISTICS ---")
print(f"Mean Discount:   {df['discount'].mean():,.4f}")
print(f"Median Discount: {df['discount'].median():,.4f}")
print(f"Min Discount:    {df['discount'].min()}")
print(f"Max Discount:    {df['discount'].max()}")

# ============================================
# 15. DELIVERY DAYS STATISTICS
# ============================================
print("\n--- 14. DELIVERY DAYS STATISTICS ---")
print(f"Mean Delivery Days:   {df['delivery_days'].mean():,.2f}")
print(f"Median Delivery Days: {df['delivery_days'].median():,.2f}")
print(f"Min Delivery Days:    {df['delivery_days'].min()}")
print(f"Max Delivery Days:    {df['delivery_days'].max()}")

# ============================================
# 16. CUSTOMER RATING STATISTICS
# ============================================
print("\n--- 15. CUSTOMER RATING STATISTICS ---")
print(f"Mean Rating:   {df['customer_rating'].mean():,.2f}")
print(f"Median Rating: {df['customer_rating'].median():,.2f}")
print(f"Min Rating:    {df['customer_rating'].min()}")
print(f"Max Rating:    {df['customer_rating'].max()}")

# ============================================
# 17. ORDER ID UNIQUENESS
# ============================================
print("\n--- 16. ORDER ID UNIQUENESS ---")
order_id_unique = df["order_id"].is_unique
print(f"Is order_id unique? {order_id_unique}")

# ============================================
# 18. CUSTOMER ID REPEATS
# ============================================
print("\n--- 17. CUSTOMER ID REPEATS ACROSS ORDERS ---")
customer_orders = df.groupby("customer_id")["order_id"].nunique()
repeat_customers = customer_orders[customer_orders > 1]
print(f"Customers with multiple orders: {len(repeat_customers)}")
print(f"Customers with single order:    {len(customer_orders) - len(repeat_customers)}")

# ============================================
# 19. REVENUE VALIDATION
# ============================================
print("\n--- 18. REVENUE VALIDATION ---")
# Calculate expected revenue using the formula:
# expected = quantity * unit_price * (1 - discount)
df["expected_revenue"] = df["quantity"] * df["unit_price"] * (1 - df["discount"])

# Calculate difference between actual and expected
df["revenue_diff"] = df["revenue"] - df["expected_revenue"]

# Check if differences are significant (more than 0.01)
significant_diff = df[df["revenue_diff"].abs() > 0.01]

print(f"Total rows: {len(df)}")
print(f"Rows with significant difference (>0.01): {len(significant_diff)}")
print(f"Mean difference: {df['revenue_diff'].mean():,.4f}")
print(f"Max difference:  {df['revenue_diff'].abs().max():,.4f}")

# Show sample of rows with differences
if len(significant_diff) > 0:
    print("\nSample rows with significant differences:")
    print(significant_diff[["order_id", "quantity", "unit_price", "discount",
                            "revenue", "expected_revenue", "revenue_diff"]].head(10))

print("\n" + "=" * 60)
print("PROFILING COMPLETE")
print("=" * 60)
