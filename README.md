# E-Commerce Sales & Customer Analytics

Beginner-level internship project for analyzing e-commerce sales data and customer behavior.

## Technologies

- **Python** - Main programming language
- **Pandas** - Data cleaning and analysis
- **SQL / SQLite** - Database queries and storage
- **Matplotlib** - Basic charts and plots
- **Seaborn** - Advanced statistical visualizations
- **Next.js** - Interactive web dashboard (planned)

## Project Structure

```
E-Commerce-Sales-Analytics/
|
|-- data/
|   |-- raw/              # Original dataset files
|
|-- database/             # SQLite database files
|
|-- sql/                  # SQL query scripts
|
|-- python/               # Python scripts for analysis
|   |-- 00_data_profiling.py
|   |-- 01_create_database.py
|   |-- 02_verify_database.py
|   |-- 03_run_sql_analysis.py
|   |-- 04_pandas_analysis.py
|   |-- 05_matplotlib_visualizations.py
|   |-- 06_seaborn_visualizations.py
|   |-- 07_generate_dashboard_data.py
|
|-- outputs/
|   |-- plots/            # Saved chart images (Matplotlib + Seaborn)
|   |-- insights/         # Text insights and summaries
|   |-- *.csv             # Analysis outputs
|
|-- web/
|   |-- data/             # Dashboard-ready JSON files
|
|-- report/
|   |-- data_dictionary.md
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

### Phase 3: SQL Analysis
- Business analysis queries
- Category, regional, payment analysis

### Phase 4: Pandas Analysis
- Data cleaning with Pandas
- SQL + Python integration
- Exploratory Data Analysis (EDA)

### Phase 5: Matplotlib Visualizations
- Bar charts, line charts, pie charts

### Phase 6: Seaborn Visualizations
- Scatter plots, distributions, relationships

### Phase 7: Dashboard Data Pipeline
- Generate dashboard-ready JSON files
- Validate data consistency

### Phase 8: Next.js Dashboard (Planned)
- Build interactive web dashboard
- Create KPI cards and filters
- Add charts and visualizations

## Data Pipeline

```
Dataset (CSV)
    ↓
SQLite Database
    ↓
SQL Analysis
    ↓
Python + Pandas Analysis
    ↓
Matplotlib + Seaborn Visualizations
    ↓
Dashboard-ready JSON Files
    ↓
Next.js Interactive Dashboard
```

## Setup Instructions

1. Clone the repository
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Place your dataset CSV in `data/raw/`
4. Run the scripts in order (00 to 07)

## Regenerating Dashboard Data

To regenerate the JSON files for the dashboard:

```bash
python python/07_generate_dashboard_data.py
```

## Learning Outcomes

- Data cleaning and preprocessing
- SQL database creation and querying
- Exploratory Data Analysis techniques
- Data visualization with Matplotlib and Seaborn
- Dashboard data preparation
