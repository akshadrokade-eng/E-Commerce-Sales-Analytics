"""
Seaborn Exploratory Visualizations
====================================
Purpose: Create charts to explore relationships in e-commerce data.
This script uses Seaborn with Matplotlib for advanced visualizations.
"""

import sqlite3
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os

# Create outputs/plots directory if it doesn't exist
os.makedirs("outputs/plots", exist_ok=True)

# Load data from SQLite database
DB_PATH = "database/ecommerce_sales.db"
conn = sqlite3.connect(DB_PATH)
df = pd.read_sql_query("SELECT * FROM sales", conn)
conn.close()

print("=" * 60)
print("CREATING SEABORN EXPLORATORY VISUALIZATIONS")
print("=" * 60)


# ============================================
# 1. Revenue Distribution
# ============================================
print("\n1. Creating Revenue Distribution chart...")

# Create histogram with KDE curve
plt.figure(figsize=(10, 5))
sns.histplot(data=df, x="revenue", kde=True, bins=30)
plt.title("Revenue Distribution")
plt.xlabel("Revenue")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("outputs/plots/revenue_distribution.png")
plt.close()

print("   Saved: outputs/plots/revenue_distribution.png")


# ============================================
# 2. Quantity vs Revenue
# ============================================
print("\n2. Creating Quantity vs Revenue scatter plot...")

plt.figure(figsize=(10, 5))
sns.scatterplot(data=df, x="quantity", y="revenue")
plt.title("Quantity vs Revenue")
plt.xlabel("Quantity")
plt.ylabel("Revenue")
plt.tight_layout()
plt.savefig("outputs/plots/quantity_vs_revenue.png")
plt.close()

print("   Saved: outputs/plots/quantity_vs_revenue.png")


# ============================================
# 3. Discount vs Revenue
# ============================================
print("\n3. Creating Discount vs Revenue scatter plot...")

plt.figure(figsize=(10, 5))
sns.scatterplot(data=df, x="discount", y="revenue")
plt.title("Discount vs Revenue")
plt.xlabel("Discount")
plt.ylabel("Revenue")
plt.tight_layout()
plt.savefig("outputs/plots/discount_vs_revenue.png")
plt.close()

print("   Saved: outputs/plots/discount_vs_revenue.png")


# ============================================
# 4. Delivery Days vs Customer Rating
# ============================================
print("\n4. Creating Delivery Days vs Rating scatter plot...")

plt.figure(figsize=(10, 5))
sns.scatterplot(data=df, x="delivery_days", y="customer_rating")
plt.title("Delivery Days vs Customer Rating")
plt.xlabel("Delivery Days")
plt.ylabel("Customer Rating")
plt.tight_layout()
plt.savefig("outputs/plots/delivery_days_vs_rating.png")
plt.close()

print("   Saved: outputs/plots/delivery_days_vs_rating.png")


# ============================================
# 5. Category and Region Revenue
# ============================================
print("\n5. Creating Category and Region Revenue chart...")

plt.figure(figsize=(10, 5))
sns.barplot(data=df, x="product_category", y="revenue", hue="region")
plt.title("Revenue by Product Category and Region")
plt.xlabel("Product Category")
plt.ylabel("Revenue")
plt.legend(title="Region")
plt.tight_layout()
plt.savefig("outputs/plots/category_region_revenue.png")
plt.close()

print("   Saved: outputs/plots/category_region_revenue.png")


# ============================================
# SUMMARY
# ============================================
print("\n" + "=" * 60)
print("VISUALIZATION COMPLETE")
print("=" * 60)

# List all generated files
print("\nGenerated chart files:")
chart_files = [
    "outputs/plots/revenue_distribution.png",
    "outputs/plots/quantity_vs_revenue.png",
    "outputs/plots/discount_vs_revenue.png",
    "outputs/plots/delivery_days_vs_rating.png",
    "outputs/plots/category_region_revenue.png"
]

for i, file in enumerate(chart_files, 1):
    print(f"  {i}. {file}")

print(f"\nTotal charts created: {len(chart_files)}")
