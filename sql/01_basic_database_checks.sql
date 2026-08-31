-- ============================================
-- Basic Database Verification Queries
-- ============================================
-- Purpose: Verify the database was created correctly
-- Database: ecommerce_sales.db
-- Table: sales

-- 1. Count total records
SELECT COUNT(*) AS total_records
FROM sales;

-- 2. Check minimum and maximum order date
SELECT MIN(order_date) AS min_order_date,
       MAX(order_date) AS max_order_date
FROM sales;

-- 3. Count unique customers
SELECT COUNT(DISTINCT customer_id) AS unique_customers
FROM sales;

-- 4. Count unique orders
SELECT COUNT(DISTINCT order_id) AS unique_orders
FROM sales;

-- 5. Calculate total revenue
SELECT SUM(revenue) AS total_revenue
FROM sales;

-- 6. Calculate total quantity
SELECT SUM(quantity) AS total_quantity
FROM sales;

-- 7. Show available product categories
SELECT DISTINCT product_category
FROM sales
ORDER BY product_category;

-- 8. Show available regions
SELECT DISTINCT region
FROM sales
ORDER BY region;

-- 9. Show available payment methods
SELECT DISTINCT payment_method
FROM sales
ORDER BY payment_method;
