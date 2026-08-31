# Data Dictionary

## E-Commerce Sales Analytics Dataset

This document explains each column in the dataset in simple language.

---

### Column Descriptions

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| order_id | Integer | Unique ID for each order. Each order has a different number. |
| order_date | Date | The date when the order was placed. Format: M/D/YYYY |
| customer_id | Integer | Unique ID for each customer. Same customer has same ID across orders. |
| product_category | Text | The type of product ordered. Categories: Electronics, Clothing, Home, Beauty |
| region | Text | The geographic area where the order was placed. Regions: West, North, South, East |
| quantity | Integer | Number of items ordered. Range: 1 to 7 |
| unit_price | Decimal | Price of one item in the order. In local currency. |
| discount | Decimal | Discount applied to the order. 0.10 means 10% discount. Range: 0 to 0.35 |
| payment_method | Text | How the customer paid. Methods: Card, COD (Cash on Delivery), Wallet |
| delivery_days | Integer | Number of days taken to deliver the order. Range: 1 to 11 |
| customer_rating | Decimal | Rating given by customer after delivery. Range: 1.0 to 5.0 |
| revenue | Decimal | Total revenue from the order after discount. = quantity * unit_price * (1 - discount) |

---

### Notes

- The dataset contains 5,000 orders
- Date range: January 2022 to September 2035
- All columns have complete data (no missing values)
- Each row represents one order
- The dataset is suitable for sales, customer, and regional analysis
