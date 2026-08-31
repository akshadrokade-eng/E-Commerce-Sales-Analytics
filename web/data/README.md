# Dashboard Data

## Purpose

This directory contains JSON files generated from the SQLite database for the Next.js dashboard.

## Source Database

- **Database:** `database/ecommerce_sales.db`
- **Table:** `sales`
- **Records:** 5,000 orders

## JSON Files

| File | Description |
|------|-------------|
| `summary.json` | Overall business metrics (total revenue, orders, customers, etc.) |
| `category.json` | Revenue and metrics by product category |
| `region.json` | Revenue and metrics by region |
| `payment.json` | Orders and revenue by payment method with percentages |
| `yearly.json` | Yearly sales trends |
| `monthly.json` | Monthly sales trends |
| `customers.json` | Customer-level analytics (sorted by revenue) |
| `operations.json` | Delivery and rating distributions |
| `relationships.json` | Scatter plot data and correlation coefficients |

## How to Regenerate

Run the data generation script:

```bash
python python/07_generate_dashboard_data.py
```

This will regenerate all JSON files in the `web/data/` directory.

## Important Notes

- All data is generated from the SQLite database
- No dashboard metrics are hardcoded
- Revenue totals are validated against the database
- JSON files are ready to be consumed by the Next.js application
