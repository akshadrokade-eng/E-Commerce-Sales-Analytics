# E-Commerce Sales & Customer Analytics

Beginner-level internship project for analyzing e-commerce sales data and customer behavior.

## Technologies

- **Python** - Main programming language
- **Pandas** - Data cleaning and analysis
- **SQL / SQLite** - Database queries and storage
- **Matplotlib** - Basic charts and plots
- **Seaborn** - Advanced statistical visualizations
- **Power BI** - Interactive business dashboard

## Project Structure

```
E-Commerce-Sales-Analytics/
|
|-- data/
|   |-- raw/              # Original dataset files
|   |-- cleaned/          # Cleaned dataset after processing
|
|-- database/             # SQLite database files
|
|-- sql/                  # SQL query scripts
|
|-- python/               # Python scripts for analysis
|   |-- 01_data_cleaning.py
|   |-- 02_sql_analysis.py
|   |-- 03_eda.py
|   |-- 04_matplotlib_viz.py
|   |-- 05_seaborn_viz.py
|
|-- powerbi/              # Power BI dashboard files
|
|-- outputs/
|   |-- plots/            # Saved chart images
|   |-- insights/         # Text insights and summaries
|
|-- requirements.txt      # Python dependencies
|-- README.md             # This file
```

## Project Phases

### Phase 1: Dataset
- Obtain e-commerce dataset (CSV)
- Understand columns and data types

### Phase 2: Database
- Create SQLite database
- Import CSV data into database
- Run SQL queries for analysis

### Phase 3: Python Analysis
- Data cleaning with Pandas
- SQL + Python integration
- Exploratory Data Analysis (EDA)

### Phase 4: Visualizations
- Matplotlib charts (bar, line, pie, histogram)
- Seaborn charts (heatmaps, box plots, pair plots)

### Phase 5: Power BI Dashboard
- Import data from SQLite
- Build interactive dashboard
- Create KPI cards and filters

## Setup Instructions

1. Clone the repository
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Place your dataset CSV in `data/raw/`
4. Follow the scripts in order (01 to 05)

## Learning Outcomes

- Data cleaning and preprocessing
- SQL database creation and querying
- Exploratory Data Analysis techniques
- Data visualization with Matplotlib and Seaborn
- Business intelligence with Power BI
