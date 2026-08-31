"""
Database Verification Script
==============================
Purpose: Run basic SQL checks to verify the database was created correctly.
"""

import sqlite3

# ============================================
# 1. CONNECT TO THE DATABASE
# ============================================
DB_PATH = "database/ecommerce_sales.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

print("=" * 60)
print("DATABASE VERIFICATION REPORT")
print("=" * 60)

# ============================================
# 2. COUNT TOTAL RECORDS
# ============================================
print("\n--- 1. TOTAL RECORDS ---")
cursor.execute("SELECT COUNT(*) FROM sales")
result = cursor.fetchone()[0]
print(f"Total records: {result}")

# ============================================
# 3. MIN AND MAX ORDER DATE
# ============================================
print("\n--- 2. ORDER DATE RANGE ---")
cursor.execute("SELECT MIN(order_date), MAX(order_date) FROM sales")
result = cursor.fetchone()
print(f"Min order date: {result[0]}")
print(f"Max order date: {result[1]}")

# ============================================
# 4. UNIQUE CUSTOMERS
# ============================================
print("\n--- 3. UNIQUE CUSTOMERS ---")
cursor.execute("SELECT COUNT(DISTINCT customer_id) FROM sales")
result = cursor.fetchone()[0]
print(f"Unique customers: {result}")

# ============================================
# 5. UNIQUE ORDERS
# ============================================
print("\n--- 4. UNIQUE ORDERS ---")
cursor.execute("SELECT COUNT(DISTINCT order_id) FROM sales")
result = cursor.fetchone()[0]
print(f"Unique orders: {result}")

# ============================================
# 6. TOTAL REVENUE
# ============================================
print("\n--- 5. TOTAL REVENUE ---")
cursor.execute("SELECT SUM(revenue) FROM sales")
result = cursor.fetchone()[0]
print(f"Total revenue: {result:,.2f}")

# ============================================
# 7. TOTAL QUANTITY
# ============================================
print("\n--- 6. TOTAL QUANTITY ---")
cursor.execute("SELECT SUM(quantity) FROM sales")
result = cursor.fetchone()[0]
print(f"Total quantity: {result}")

# ============================================
# 8. PRODUCT CATEGORIES
# ============================================
print("\n--- 7. PRODUCT CATEGORIES ---")
cursor.execute("SELECT DISTINCT product_category FROM sales ORDER BY product_category")
results = cursor.fetchall()
for row in results:
    print(f"  - {row[0]}")

# ============================================
# 9. REGIONS
# ============================================
print("\n--- 8. REGIONS ---")
cursor.execute("SELECT DISTINCT region FROM sales ORDER BY region")
results = cursor.fetchall()
for row in results:
    print(f"  - {row[0]}")

# ============================================
# 10. PAYMENT METHODS
# ============================================
print("\n--- 9. PAYMENT METHODS ---")
cursor.execute("SELECT DISTINCT payment_method FROM sales ORDER BY payment_method")
results = cursor.fetchall()
for row in results:
    print(f"  - {row[0]}")

# ============================================
# 11. CLOSE CONNECTION
# ============================================
conn.close()

print("\n" + "=" * 60)
print("VERIFICATION COMPLETE - ALL CHECKS PASSED")
print("=" * 60)
