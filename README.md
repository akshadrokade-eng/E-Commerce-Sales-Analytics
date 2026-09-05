# E-Commerce Sales & Customer Analytics

A comprehensive analytics project analyzing e-commerce sales data, customer behavior, and operational performance through an interactive Next.js dashboard.

## Project Overview

This project processes raw e-commerce sales data through a complete analytics pipeline — from data profiling and database creation to SQL analysis, Python-based statistical analysis, and a premium interactive web dashboard built with Next.js, React, and TypeScript.

## Objectives

- Analyze e-commerce sales patterns across categories, regions, and payment methods
- Understand customer behavior, retention, and revenue distribution
- Evaluate operational performance including delivery times and customer ratings
- Identify correlations between key business metrics
- Present insights through an interactive, visually polished dashboard

## Key Features

- **5 interactive dashboard pages** with real-time data visualization
- **Premium dark theme UI** with smooth Framer Motion animations
- **16+ chart types** including area, bar, donut, scatter, and histogram charts
- **Responsive design** for desktop and mobile devices
- **Complete data pipeline** from CSV to interactive dashboard
- **Statistical analysis** with correlation calculations and trend identification

## Technology Stack

### Data Processing
- **Python** — Main programming language
- **Pandas** — Data cleaning, transformation, and analysis
- **SQLite** — Database storage and SQL queries
- **SQL** — Database analysis queries
- **Matplotlib** — Static chart visualizations
- **Seaborn** — Statistical visualizations

### Dashboard
- **Next.js 16** — React framework with App Router
- **React 19** — UI component library
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first CSS styling
- **Recharts** — React charting library
- **Framer Motion** — Animation library
- **Lucide React** — Icon library

## Dataset Information

- **Total Orders:** 5,000
- **Unique Customers:** 989
- **Date Range:** January 1, 2022 to September 9, 2035
- **Revenue:** ₹5,109,775.74
- **Categories:** Electronics, Clothing, Home & Garden, Books, Sports
- **Regions:** East, West, North, South
- **Payment Methods:** Card, UPI, Cash on Delivery, Net Banking

> **Note:** 2035 is a partial year (through September 9). The dataset may be synthetic or limited in scope.

## Data Analysis Workflow

```
Dataset (CSV)
    ↓
Python Data Profiling (00_data_profiling.py)
    ↓
SQLite Database (01_create_database.py)
    ↓
Database Verification (02_verify_database.py)
    ↓
SQL Analysis (03_run_sql_analysis.py)
    ↓
Pandas Analysis (04_pandas_analysis.py)
    ↓
Matplotlib Visualizations (05_matplotlib_visualizations.py)
    ↓
Seaborn Visualizations (06_seaborn_visualizations.py)
    ↓
Dashboard JSON Generation (07_generate_dashboard_data.py)
    ↓
Next.js Analytics Dashboard
```

## Dashboard Pages

### 1. Dashboard (`/`)
- KPI cards: Total Revenue, Total Orders, Unique Customers, Average Order Value
- Revenue trend (monthly area chart)
- Category revenue breakdown
- Regional revenue distribution
- Payment method distribution
- Year-over-year revenue comparison
- Business snapshot and relationship insights

### 2. Sales Analytics (`/sales`)
- Revenue trend analysis
- Category performance metrics
- Regional sales distribution
- Payment method analytics
- Yearly revenue comparison
- Sales insights and observations

### 3. Customer Analytics (`/customers`)
- Customer revenue distribution
- Orders per customer analysis
- Customer segmentation by revenue
- Top customer rankings
- Customer behavior insights

### 4. Operations Analytics (`/operations`)
- Delivery performance by region
- Delivery time distribution
- Customer rating distribution
- Rating by product category
- Delivery-rating correlation analysis
- Operational insights

### 5. Business Insights (`/insights`)
- Executive summary
- Sales performance analysis
- Customer behavior insights
- Operational metrics
- Trend analysis
- Data relationships and correlations
- Key findings
- Business observations
- Data limitations
- Future analysis suggestions

## Key Analytics

| Metric | Value |
|--------|-------|
| Total Revenue | ₹5,109,775.74 |
| Total Orders | 5,000 |
| Unique Customers | 989 |
| Repeat Customers | 950 (96.06%) |
| Average Order Value | ₹1,021.96 |
| Average Delivery Days | 6.12 |
| Average Rating | 2.97 / 5.0 |

### Correlations
- Quantity ↔ Revenue: +0.6236 (Positive)
- Discount ↔ Revenue: -0.1393 (Negative)
- Delivery Days ↔ Rating: -0.0176 (Very Weak)

## Project Structure

```
E-Commerce-Sales-Analytics/
├── data/
│   ├── raw/                    # Original dataset files
│   └── cleaned/                # Processed data
├── database/                   # SQLite database files
├── sql/                        # SQL query scripts
├── python/                     # Python analysis scripts
│   ├── 00_data_profiling.py
│   ├── 01_create_database.py
│   ├── 02_verify_database.py
│   ├── 03_run_sql_analysis.py
│   ├── 04_pandas_analysis.py
│   ├── 05_matplotlib_visualizations.py
│   ├── 06_seaborn_visualizations.py
│   └── 07_generate_dashboard_data.py
├── outputs/
│   ├── plots/                  # Saved chart images
│   ├── insights/               # Text insights
│   └── *.csv                   # Analysis outputs
├── web/
│   ├── public/data/            # Dashboard JSON files
│   └── src/
│       ├── app/                # Next.js pages
│       ├── components/         # React components
│       ├── lib/                # Utilities and data
│       └── types/              # TypeScript types
├── report/
│   └── data_dictionary.md
├── requirements.txt
└── README.md
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Python Setup
```bash
# Clone the repository
git clone https://github.com/akshadrokade-eng/E-Commerce-Sales-Analytics.git
cd E-Commerce-Sales-Analytics

# Install Python dependencies
pip install -r requirements.txt
```

### Dashboard Setup
```bash
# Navigate to web directory
cd web

# Install dependencies
npm install
```

## How to Run

### Run the Data Pipeline
```bash
# Run scripts in order from project root
python python/00_data_profiling.py
python python/01_create_database.py
python python/02_verify_database.py
python python/03_run_sql_analysis.py
python python/04_pandas_analysis.py
python python/05_matplotlib_visualizations.py
python python/06_seaborn_visualizations.py
python python/07_generate_dashboard_data.py
```

### Run the Dashboard
```bash
# Development mode
cd web
npm run dev

# Production build
cd web
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Dashboard Routes

| Route | Description |
|-------|-------------|
| `/` | Main dashboard with KPIs and overview charts |
| `/sales` | Sales analytics with revenue, category, and regional analysis |
| `/customers` | Customer analytics with revenue distribution and rankings |
| `/operations` | Operations analytics with delivery and rating metrics |
| `/insights` | Business insights with trends, correlations, and findings |

## Data Limitations

- **Partial Year:** 2035 data is incomplete (through September 9)
- **Dataset Size:** 5,000 orders may not represent full business scale
- **Synthetic Data:** The dataset may be synthetic or limited in scope
- **No Demographics:** Customer demographic information is not available
- **Correlation ≠ Causation:** Statistical correlations do not imply causal relationships
- **Date Range:** Spans 2022-2035, which may include future dates depending on context

## Using a Custom Dataset

You can upload your own compatible e-commerce CSV dataset to replace the default data.

### Prerequisites

Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Step 1: Start the Python Backend

```bash
cd backend
uvicorn app:app --host 127.0.0.1 --port 8000
```

The API server will start at `http://127.0.0.1:8000`.

### Step 2: Start the Next.js Dashboard

```bash
cd web
npm run dev
```

### Step 3: Upload Dataset

1. Open the dashboard at `http://localhost:3000`
2. Click the **Dataset** button in the header
3. Select a compatible CSV file
4. Review the preview and validation status
5. Click **Process Dataset**
6. Wait for processing to complete
7. Dashboard updates automatically with new data

### Required CSV Columns

Your CSV must contain these columns:

| Column | Description | Example |
|--------|-------------|---------|
| `order_id` | Unique order identifier | 10001 |
| `order_date` | Date of order (MM/DD/YYYY or ISO format) | 1/15/2024 |
| `customer_id` | Customer identifier | 1102 |
| `product_category` | Product category | Electronics |
| `region` | Geographic region | West |
| `quantity` | Number of items | 3 |
| `unit_price` | Price per unit | 299.99 |
| `discount` | Discount rate (0-1) | 0.15 |
| `payment_method` | Payment method | Card |
| `delivery_days` | Days to deliver | 5 |
| `customer_rating` | Rating (0-5) | 4.2 |
| `revenue` | Total revenue | 764.97 |

### Validation Rules

- File must be `.csv` format
- Dataset cannot be empty
- All required columns must be present
- Numeric fields must contain valid numbers
- Dates must be parseable
- Discount values must be between 0 and 1
- Customer rating must be between 0 and 5
- Quantity, price, and revenue must be non-negative

### Reset to Default Dataset

Click **Reset to Default** in the Dataset Management modal to restore the original dataset.

## Future Scope

- Real-time data integration from live databases
- User authentication and role-based access control
- Export functionality for reports and charts
- Advanced predictive analytics using machine learning
- Custom date range filtering and drill-down capabilities
- Multi-language support
- Performance optimization for large datasets

## Author

**Akshad Rokade**
- GitHub: [akshadrokade-eng](https://github.com/akshadrokade-eng)

---

*This project was developed as part of an internship program, demonstrating end-to-end data analytics from raw data to interactive dashboard.*
