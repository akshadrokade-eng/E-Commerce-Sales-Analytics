"""
SQL Business Analysis Script
==============================
Purpose: Run SQL queries on the SQLite database and display results.
This script demonstrates SQL -> Python -> Pandas integration.
"""

import sqlite3
import pandas as pd

# ============================================
# 1. CONNECT TO THE DATABASE
# ============================================
DB_PATH = "database/ecommerce_sales.db"
conn = sqlite3.connect(DB_PATH)

print("=" * 60)
print("SQL BUSINESS ANALYSIS RESULTS")
print("=" * 60)


# ============================================
# SECTION 1 — Overall Sales
# ============================================
print("\n" + "=" * 60)
print("SECTION 1 — OVERALL SALES")
print("=" * 60)

# 1.1 Total Revenue
query = "SELECT SUM(revenue) AS Total_Revenue FROM sales"
df = pd.read_sql_query(query, conn)
print("\n1.1 Total Revenue:")
print(df.to_string(index=False))

# 1.2 Average Revenue per Order
query = "SELECT ROUND(AVG(revenue), 2) AS Avg_Revenue_Per_Order FROM sales"
df = pd.read_sql_query(query, conn)
print("\n1.2 Average Revenue per Order:")
print(df.to_string(index=False))

# 1.3 Total Quantity Sold
query = "SELECT SUM(quantity) AS Total_Quantity_Sold FROM sales"
df = pd.read_sql_query(query, conn)
print("\n1.3 Total Quantity Sold:")
print(df.to_string(index=False))

# 1.4 Total Number of Orders
query = "SELECT COUNT(*) AS Total_Orders FROM sales"
df = pd.read_sql_query(query, conn)
print("\n1.4 Total Number of Orders:")
print(df.to_string(index=False))

# 1.5 Average Order Quantity
query = "SELECT ROUND(AVG(quantity), 2) AS Avg_Order_Quantity FROM sales"
df = pd.read_sql_query(query, conn)
print("\n1.5 Average Order Quantity:")
print(df.to_string(index=False))


# ============================================
# SECTION 2 — Category Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 2 — CATEGORY ANALYSIS")
print("=" * 60)

# 2.1 Revenue by Product Category
query = """
SELECT product_category,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY product_category
ORDER BY Total_Revenue DESC
"""
df = pd.read_sql_query(query, conn)
print("\n2.1 Revenue by Product Category:")
print(df.to_string(index=False))

# 2.2 Quantity Sold by Category
query = """
SELECT product_category,
       SUM(quantity) AS Total_Quantity
FROM sales
GROUP BY product_category
ORDER BY Total_Quantity DESC
"""
df = pd.read_sql_query(query, conn)
print("\n2.2 Quantity Sold by Category:")
print(df.to_string(index=False))

# 2.3 Average Unit Price by Category
query = """
SELECT product_category,
       ROUND(AVG(unit_price), 2) AS Avg_Unit_Price
FROM sales
GROUP BY product_category
ORDER BY Avg_Unit_Price DESC
"""
df = pd.read_sql_query(query, conn)
print("\n2.3 Average Unit Price by Category:")
print(df.to_string(index=False))

# 2.4 Average Discount by Category
query = """
SELECT product_category,
       ROUND(AVG(discount), 4) AS Avg_Discount
FROM sales
GROUP BY product_category
ORDER BY Avg_Discount DESC
"""
df = pd.read_sql_query(query, conn)
print("\n2.4 Average Discount by Category:")
print(df.to_string(index=False))

# 2.5 Average Customer Rating by Category
query = """
SELECT product_category,
       ROUND(AVG(customer_rating), 2) AS Avg_Customer_Rating
FROM sales
GROUP BY product_category
ORDER BY Avg_Customer_Rating DESC
"""
df = pd.read_sql_query(query, conn)
print("\n2.5 Average Customer Rating by Category:")
print(df.to_string(index=False))


# ============================================
# SECTION 3 — Regional Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 3 — REGIONAL ANALYSIS")
print("=" * 60)

# 3.1 Revenue by Region
query = """
SELECT region,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY region
ORDER BY Total_Revenue DESC
"""
df = pd.read_sql_query(query, conn)
print("\n3.1 Revenue by Region:")
print(df.to_string(index=False))

# 3.2 Quantity Sold by Region
query = """
SELECT region,
       SUM(quantity) AS Total_Quantity
FROM sales
GROUP BY region
ORDER BY Total_Quantity DESC
"""
df = pd.read_sql_query(query, conn)
print("\n3.2 Quantity Sold by Region:")
print(df.to_string(index=False))

# 3.3 Number of Orders by Region
query = """
SELECT region,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY region
ORDER BY Order_Count DESC
"""
df = pd.read_sql_query(query, conn)
print("\n3.3 Number of Orders by Region:")
print(df.to_string(index=False))

# 3.4 Average Delivery Days by Region
query = """
SELECT region,
       ROUND(AVG(delivery_days), 2) AS Avg_Delivery_Days
FROM sales
GROUP BY region
ORDER BY Avg_Delivery_Days
"""
df = pd.read_sql_query(query, conn)
print("\n3.4 Average Delivery Days by Region:")
print(df.to_string(index=False))

# 3.5 Average Customer Rating by Region
query = """
SELECT region,
       ROUND(AVG(customer_rating), 2) AS Avg_Customer_Rating
FROM sales
GROUP BY region
ORDER BY Avg_Customer_Rating DESC
"""
df = pd.read_sql_query(query, conn)
print("\n3.5 Average Customer Rating by Region:")
print(df.to_string(index=False))


# ============================================
# SECTION 4 — Payment Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 4 — PAYMENT ANALYSIS")
print("=" * 60)

# 4.1 Number of Orders by Payment Method
query = """
SELECT payment_method,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY payment_method
ORDER BY Order_Count DESC
"""
df = pd.read_sql_query(query, conn)
print("\n4.1 Number of Orders by Payment Method:")
print(df.to_string(index=False))

# 4.2 Revenue by Payment Method
query = """
SELECT payment_method,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY payment_method
ORDER BY Total_Revenue DESC
"""
df = pd.read_sql_query(query, conn)
print("\n4.2 Revenue by Payment Method:")
print(df.to_string(index=False))

# 4.3 Average Order Revenue by Payment Method
query = """
SELECT payment_method,
       ROUND(AVG(revenue), 2) AS Avg_Order_Revenue
FROM sales
GROUP BY payment_method
ORDER BY Avg_Order_Revenue DESC
"""
df = pd.read_sql_query(query, conn)
print("\n4.3 Average Order Revenue by Payment Method:")
print(df.to_string(index=False))


# ============================================
# SECTION 5 — Customer Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 5 — CUSTOMER ANALYSIS")
print("=" * 60)

# 5.1 Number of Unique Customers
query = "SELECT COUNT(DISTINCT customer_id) AS Unique_Customers FROM sales"
df = pd.read_sql_query(query, conn)
print("\n5.1 Number of Unique Customers:")
print(df.to_string(index=False))

# 5.2 Top 10 Customers by Revenue
query = """
SELECT customer_id,
       SUM(revenue) AS Total_Revenue,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY customer_id
ORDER BY Total_Revenue DESC
LIMIT 10
"""
df = pd.read_sql_query(query, conn)
print("\n5.2 Top 10 Customers by Revenue:")
print(df.to_string(index=False))


# ============================================
# SECTION 6 — Delivery Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 6 — DELIVERY ANALYSIS")
print("=" * 60)

# 6.1 Average Delivery Days
query = "SELECT ROUND(AVG(delivery_days), 2) AS Avg_Delivery_Days FROM sales"
df = pd.read_sql_query(query, conn)
print("\n6.1 Average Delivery Days:")
print(df.to_string(index=False))

# 6.2 Delivery Performance by Region
query = """
SELECT region,
       ROUND(AVG(delivery_days), 2) AS Avg_Delivery_Days,
       MIN(delivery_days) AS Min_Delivery_Days,
       MAX(delivery_days) AS Max_Delivery_Days
FROM sales
GROUP BY region
ORDER BY Avg_Delivery_Days
"""
df = pd.read_sql_query(query, conn)
print("\n6.2 Delivery Performance by Region:")
print(df.to_string(index=False))


# ============================================
# SECTION 7 — Discount Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 7 — DISCOUNT ANALYSIS")
print("=" * 60)

# 7.1 Average Discount
query = "SELECT ROUND(AVG(discount), 4) AS Avg_Discount FROM sales"
df = pd.read_sql_query(query, conn)
print("\n7.1 Average Discount:")
print(df.to_string(index=False))

# 7.2 Min and Max Discount
query = "SELECT MIN(discount) AS Min_Discount, MAX(discount) AS Max_Discount FROM sales"
df = pd.read_sql_query(query, conn)
print("\n7.2 Min and Max Discount:")
print(df.to_string(index=False))


# ============================================
# SECTION 8 — Time Analysis
# ============================================
print("\n" + "=" * 60)
print("SECTION 8 — TIME ANALYSIS")
print("=" * 60)

# 8.1 Revenue by Year
# Date format is M/D/YYYY, year is the last 4 characters
query = """
SELECT SUBSTR(order_date, -4) AS Order_Year,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY Order_Year
ORDER BY Order_Year
"""
df = pd.read_sql_query(query, conn)
print("\n8.1 Revenue by Year:")
print(df.to_string(index=False))

# 8.2 Orders by Year
query = """
SELECT SUBSTR(order_date, -4) AS Order_Year,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY Order_Year
ORDER BY Order_Year
"""
df = pd.read_sql_query(query, conn)
print("\n8.2 Orders by Year:")
print(df.to_string(index=False))

# 8.3 Revenue by Month
query = """
SELECT SUBSTR(order_date, 1, INSTR(order_date, '/') - 1) AS Order_Month,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY Order_Month
ORDER BY CAST(Order_Month AS INTEGER)
"""
df = pd.read_sql_query(query, conn)
print("\n8.3 Revenue by Month:")
print(df.to_string(index=False))

# 8.4 Orders by Month
query = """
SELECT SUBSTR(order_date, 1, INSTR(order_date, '/') - 1) AS Order_Month,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY Order_Month
ORDER BY CAST(Order_Month AS INTEGER)
"""
df = pd.read_sql_query(query, conn)
print("\n8.4 Orders by Month:")
print(df.to_string(index=False))


# ============================================
# 2. CLOSE CONNECTION
# ============================================
conn.close()

print("\n" + "=" * 60)
print("ANALYSIS COMPLETE")
print("=" * 60)
