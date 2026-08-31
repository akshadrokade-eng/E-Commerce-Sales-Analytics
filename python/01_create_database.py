"""
SQLite Database Creation Script
================================
Purpose: Create a SQLite database and import data from CSV.

This script:
1. Reads the CSV file using Pandas
2. Creates a SQLite database
3. Creates a 'sales' table
4. Imports all 5000 records

The original CSV file is NOT modified.
"""

import pandas as pd
import sqlite3
import os

# ============================================
# 1. FILE PATHS
# ============================================
# Path to the original CSV file (input)
CSV_PATH = "data/raw/ecommerce_sales_analytics_5000.csv"

# Path to the SQLite database (output)
DB_PATH = "database/ecommerce_sales.db"

# ============================================
# 2. READ THE CSV FILE
# ============================================
print("Reading CSV file...")
df = pd.read_csv(CSV_PATH)
print(f"Loaded {len(df)} rows from CSV")

# ============================================
# 3. CONNECT TO SQLITE DATABASE
# ============================================
# If the database file does not exist, SQLite creates it automatically
print(f"Connecting to database: {DB_PATH}")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# ============================================
# 4. CREATE THE SALES TABLE
# ============================================
# Drop the table if it already exists (to start fresh)
cursor.execute("DROP TABLE IF EXISTS sales")

# Create the sales table with appropriate data types
# We use the same column names as the CSV file
create_table_query = """
CREATE TABLE sales (
    order_id INTEGER PRIMARY KEY,
    order_date TEXT,
    customer_id INTEGER,
    product_category TEXT,
    region TEXT,
    quantity INTEGER,
    unit_price REAL,
    discount REAL,
    payment_method TEXT,
    delivery_days INTEGER,
    customer_rating REAL,
    revenue REAL
)
"""

cursor.execute(create_table_query)
print("Created 'sales' table")

# ============================================
# 5. IMPORT DATA FROM DATAFRAME TO DATABASE
# ============================================
# Pandas can write DataFrames directly to SQLite
# if_exists='replace' means overwrite if table exists
# index=False means do not write the DataFrame index as a column
print("Importing data into database...")
df.to_sql("sales", conn, if_exists="replace", index=False)

# ============================================
# 6. VERIFY THE IMPORT
# ============================================
# Count records in the database
cursor.execute("SELECT COUNT(*) FROM sales")
count = cursor.fetchone()[0]
print(f"Imported {count} records into 'sales' table")

# ============================================
# 7. CLOSE THE CONNECTION
# ============================================
conn.close()
print("Database connection closed")
print("Database creation complete!")
