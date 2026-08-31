-- ============================================
-- SQL Business Analysis Queries
-- Database: ecommerce_sales.db
-- Table: sales
-- ============================================

-- ============================================
-- SECTION 1 — Overall Sales
-- ============================================

-- 1.1 Total Revenue
SELECT SUM(revenue) AS Total_Revenue
FROM sales;

-- 1.2 Average Revenue per Order
SELECT AVG(revenue) AS Avg_Revenue_Per_Order
FROM sales;

-- 1.3 Total Quantity Sold
SELECT SUM(quantity) AS Total_Quantity_Sold
FROM sales;

-- 1.4 Total Number of Orders
SELECT COUNT(*) AS Total_Orders
FROM sales;

-- 1.5 Average Order Quantity
SELECT AVG(quantity) AS Avg_Order_Quantity
FROM sales;


-- ============================================
-- SECTION 2 — Category Analysis
-- ============================================

-- 2.1 Revenue by Product Category
SELECT product_category,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY product_category
ORDER BY Total_Revenue DESC;

-- 2.2 Quantity Sold by Category
SELECT product_category,
       SUM(quantity) AS Total_Quantity
FROM sales
GROUP BY product_category
ORDER BY Total_Quantity DESC;

-- 2.3 Average Unit Price by Category
SELECT product_category,
       ROUND(AVG(unit_price), 2) AS Avg_Unit_Price
FROM sales
GROUP BY product_category
ORDER BY Avg_Unit_Price DESC;

-- 2.4 Average Discount by Category
SELECT product_category,
       ROUND(AVG(discount), 4) AS Avg_Discount
FROM sales
GROUP BY product_category
ORDER BY Avg_Discount DESC;

-- 2.5 Average Customer Rating by Category
SELECT product_category,
       ROUND(AVG(customer_rating), 2) AS Avg_Customer_Rating
FROM sales
GROUP BY product_category
ORDER BY Avg_Customer_Rating DESC;


-- ============================================
-- SECTION 3 — Regional Analysis
-- ============================================

-- 3.1 Revenue by Region
SELECT region,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY region
ORDER BY Total_Revenue DESC;

-- 3.2 Quantity Sold by Region
SELECT region,
       SUM(quantity) AS Total_Quantity
FROM sales
GROUP BY region
ORDER BY Total_Quantity DESC;

-- 3.3 Number of Orders by Region
SELECT region,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY region
ORDER BY Order_Count DESC;

-- 3.4 Average Delivery Days by Region
SELECT region,
       ROUND(AVG(delivery_days), 2) AS Avg_Delivery_Days
FROM sales
GROUP BY region
ORDER BY Avg_Delivery_Days;

-- 3.5 Average Customer Rating by Region
SELECT region,
       ROUND(AVG(customer_rating), 2) AS Avg_Customer_Rating
FROM sales
GROUP BY region
ORDER BY Avg_Customer_Rating DESC;


-- ============================================
-- SECTION 4 — Payment Analysis
-- ============================================

-- 4.1 Number of Orders by Payment Method
SELECT payment_method,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY payment_method
ORDER BY Order_Count DESC;

-- 4.2 Revenue by Payment Method
SELECT payment_method,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY payment_method
ORDER BY Total_Revenue DESC;

-- 4.3 Average Order Revenue by Payment Method
SELECT payment_method,
       ROUND(AVG(revenue), 2) AS Avg_Order_Revenue
FROM sales
GROUP BY payment_method
ORDER BY Avg_Order_Revenue DESC;


-- ============================================
-- SECTION 5 — Customer Analysis
-- ============================================

-- 5.1 Number of Unique Customers
SELECT COUNT(DISTINCT customer_id) AS Unique_Customers
FROM sales;

-- 5.2 Number of Orders per Customer
SELECT customer_id,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY customer_id
ORDER BY Order_Count DESC;

-- 5.3 Revenue per Customer
SELECT customer_id,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY customer_id
ORDER BY Total_Revenue DESC;

-- 5.4 Top 10 Customers by Revenue
SELECT customer_id,
       SUM(revenue) AS Total_Revenue,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY customer_id
ORDER BY Total_Revenue DESC
LIMIT 10;


-- ============================================
-- SECTION 6 — Delivery Analysis
-- ============================================

-- 6.1 Average Delivery Days
SELECT ROUND(AVG(delivery_days), 2) AS Avg_Delivery_Days
FROM sales;

-- 6.2 Minimum Delivery Days
SELECT MIN(delivery_days) AS Min_Delivery_Days
FROM sales;

-- 6.3 Maximum Delivery Days
SELECT MAX(delivery_days) AS Max_Delivery_Days
FROM sales;

-- 6.4 Delivery Performance by Region
SELECT region,
       ROUND(AVG(delivery_days), 2) AS Avg_Delivery_Days,
       MIN(delivery_days) AS Min_Delivery_Days,
       MAX(delivery_days) AS Max_Delivery_Days
FROM sales
GROUP BY region
ORDER BY Avg_Delivery_Days;


-- ============================================
-- SECTION 7 — Discount Analysis
-- ============================================

-- 7.1 Average Discount
SELECT ROUND(AVG(discount), 4) AS Avg_Discount
FROM sales;

-- 7.2 Minimum Discount
SELECT MIN(discount) AS Min_Discount
FROM sales;

-- 7.3 Maximum Discount
SELECT MAX(discount) AS Max_Discount
FROM sales;

-- 7.4 Revenue Grouped by Discount Percentage
-- Rounding discount to 2 decimal places for grouping
SELECT ROUND(discount, 2) AS Discount_Percentage,
       COUNT(*) AS Order_Count,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY ROUND(discount, 2)
ORDER BY Discount_Percentage;


-- ============================================
-- SECTION 8 — Time Analysis
-- ============================================
-- Date format in database: M/D/YYYY (stored as TEXT)
-- Example: "1/1/2022" means January 1, 2022
-- Month is before first "/", Year is the last 4 characters

-- 8.1 Revenue by Year
-- Extract year as the last 4 characters of the date string
SELECT SUBSTR(order_date, -4) AS Order_Year,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY Order_Year
ORDER BY Order_Year;

-- 8.2 Number of Orders by Year
SELECT SUBSTR(order_date, -4) AS Order_Year,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY Order_Year
ORDER BY Order_Year;

-- 8.3 Revenue by Month
-- Extract month as the part before the first "/"
SELECT SUBSTR(order_date, 1, INSTR(order_date, '/') - 1) AS Order_Month,
       SUM(revenue) AS Total_Revenue
FROM sales
GROUP BY Order_Month
ORDER BY CAST(Order_Month AS INTEGER);

-- 8.4 Number of Orders by Month
SELECT SUBSTR(order_date, 1, INSTR(order_date, '/') - 1) AS Order_Month,
       COUNT(*) AS Order_Count
FROM sales
GROUP BY Order_Month
ORDER BY CAST(Order_Month AS INTEGER);
