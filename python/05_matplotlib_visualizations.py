"""
Matplotlib Visualizations
===========================
Purpose: Create charts to visualize e-commerce data.
This script uses only Matplotlib (no Seaborn yet).
"""

import pandas as pd
import matplotlib.pyplot as plt
import os

# Create outputs/plots directory if it doesn't exist
os.makedirs("outputs/plots", exist_ok=True)

print("=" * 60)
print("CREATING MATPLOTLIB VISUALIZATIONS")
print("=" * 60)


# ============================================
# 1. Revenue by Product Category
# ============================================
print("\n1. Creating Revenue by Product Category chart...")

# Load data from saved CSV
category_df = pd.read_csv("outputs/category_analysis.csv")

# Create bar chart
plt.figure(figsize=(8, 5))
plt.bar(category_df["product_category"], category_df["Total_Revenue"])
plt.title("Revenue by Product Category")
plt.xlabel("Product Category")
plt.ylabel("Total Revenue")
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig("outputs/plots/revenue_by_category.png")
plt.close()

print("   Saved: outputs/plots/revenue_by_category.png")


# ============================================
# 2. Revenue by Region
# ============================================
print("\n2. Creating Revenue by Region chart...")

region_df = pd.read_csv("outputs/region_analysis.csv")

plt.figure(figsize=(8, 5))
plt.bar(region_df["region"], region_df["Total_Revenue"])
plt.title("Revenue by Region")
plt.xlabel("Region")
plt.ylabel("Total Revenue")
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig("outputs/plots/revenue_by_region.png")
plt.close()

print("   Saved: outputs/plots/revenue_by_region.png")


# ============================================
# 3. Orders by Payment Method
# ============================================
print("\n3. Creating Orders by Payment Method chart...")

payment_df = pd.read_csv("outputs/payment_analysis.csv")

plt.figure(figsize=(8, 5))
plt.bar(payment_df["payment_method"], payment_df["Order_Count"])
plt.title("Orders by Payment Method")
plt.xlabel("Payment Method")
plt.ylabel("Number of Orders")
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig("outputs/plots/orders_by_payment_method.png")
plt.close()

print("   Saved: outputs/plots/orders_by_payment_method.png")


# ============================================
# 4. Monthly Revenue
# ============================================
print("\n4. Creating Monthly Revenue chart...")

monthly_df = pd.read_csv("outputs/monthly_sales.csv")

plt.figure(figsize=(10, 5))
plt.plot(monthly_df["month"], monthly_df["Total_Revenue"], marker="o")
plt.title("Monthly Revenue")
plt.xlabel("Month")
plt.ylabel("Total Revenue")
plt.xticks(range(1, 13))
plt.tight_layout()
plt.savefig("outputs/plots/monthly_revenue.png")
plt.close()

print("   Saved: outputs/plots/monthly_revenue.png")


# ============================================
# 5. Yearly Revenue
# ============================================
print("\n5. Creating Yearly Revenue chart...")

yearly_df = pd.read_csv("outputs/yearly_sales.csv")

plt.figure(figsize=(10, 5))
plt.plot(yearly_df["year"], yearly_df["Total_Revenue"], marker="o")
plt.title("Yearly Revenue")
plt.xlabel("Year")
plt.ylabel("Total Revenue")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("outputs/plots/yearly_revenue.png")
plt.close()

print("   Saved: outputs/plots/yearly_revenue.png")


# ============================================
# 6. Quantity Sold by Product Category
# ============================================
print("\n6. Creating Quantity by Category chart...")

plt.figure(figsize=(8, 5))
plt.bar(category_df["product_category"], category_df["Total_Quantity"])
plt.title("Quantity Sold by Product Category")
plt.xlabel("Product Category")
plt.ylabel("Total Quantity")
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig("outputs/plots/quantity_by_category.png")
plt.close()

print("   Saved: outputs/plots/quantity_by_category.png")


# ============================================
# 7. Average Delivery Days by Region
# ============================================
print("\n7. Creating Delivery Days by Region chart...")

plt.figure(figsize=(8, 5))
plt.bar(region_df["region"], region_df["Avg_Delivery_Days"])
plt.title("Average Delivery Days by Region")
plt.xlabel("Region")
plt.ylabel("Average Delivery Days")
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig("outputs/plots/delivery_days_by_region.png")
plt.close()

print("   Saved: outputs/plots/delivery_days_by_region.png")


# ============================================
# 8. Average Customer Rating by Product Category
# ============================================
print("\n8. Creating Rating by Category chart...")

plt.figure(figsize=(8, 5))
plt.bar(category_df["product_category"], category_df["Avg_Customer_Rating"])
plt.title("Average Customer Rating by Product Category")
plt.xlabel("Product Category")
plt.ylabel("Average Rating")
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig("outputs/plots/rating_by_category.png")
plt.close()

print("   Saved: outputs/plots/rating_by_category.png")


# ============================================
# SUMMARY
# ============================================
print("\n" + "=" * 60)
print("VISUALIZATION COMPLETE")
print("=" * 60)

# List all generated files
print("\nGenerated chart files:")
chart_files = [
    "outputs/plots/revenue_by_category.png",
    "outputs/plots/revenue_by_region.png",
    "outputs/plots/orders_by_payment_method.png",
    "outputs/plots/monthly_revenue.png",
    "outputs/plots/yearly_revenue.png",
    "outputs/plots/quantity_by_category.png",
    "outputs/plots/delivery_days_by_region.png",
    "outputs/plots/rating_by_category.png"
]

for i, file in enumerate(chart_files, 1):
    print(f"  {i}. {file}")

print(f"\nTotal charts created: {len(chart_files)}")
