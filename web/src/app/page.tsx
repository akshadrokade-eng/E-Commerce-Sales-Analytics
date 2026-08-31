'use client';

import Header from '@/components/layout/Header';
import KPICard from '@/components/dashboard/KPICard';
import ChartPanel from '@/components/dashboard/ChartPanel';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  SummaryData,
  CategoryData,
  RegionData,
  MonthlyData,
} from '@/types';

// Format currency as INR
function formatINR(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

// Format number with commas
function formatNumber(value: number): string {
  return value.toLocaleString('en-IN');
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from JSON files
    Promise.all([
      fetch('/data/summary.json').then((res) => res.json()),
      fetch('/data/category.json').then((res) => res.json()),
      fetch('/data/region.json').then((res) => res.json()),
      fetch('/data/monthly.json').then((res) => res.json()),
    ]).then(([summaryData, categoryData, regionData, monthlyData]) => {
      setSummary(summaryData);
      setCategories(categoryData);
      setRegions(regionData);
      setMonthly(monthlyData);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Loading dashboard data...</div>
      </div>
    );
  }

  // Sort categories by revenue for display
  const sortedCategories = [...categories].sort((a, b) => b.revenue - a.revenue);

  // Sort regions by revenue for display
  const sortedRegions = [...regions].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-8">
      <Header
        title="E-Commerce Analytics"
        description="Sales, customer and operational performance"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={formatINR(summary.total_revenue)}
          subtitle={`${formatNumber(summary.total_orders)} orders`}
          icon={DollarSign}
          index={0}
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(summary.total_orders)}
          subtitle={`${summary.unique_customers} unique customers`}
          icon={ShoppingCart}
          index={1}
        />
        <KPICard
          title="Unique Customers"
          value={formatNumber(summary.unique_customers)}
          subtitle={`${summary.average_order_revenue.toFixed(0)} avg order value`}
          icon={Users}
          index={2}
        />
        <KPICard
          title="Avg Order Revenue"
          value={formatINR(summary.average_order_revenue)}
          subtitle={`Qty: ${summary.average_quantity}`}
          icon={TrendingUp}
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <ChartPanel title="Revenue by Category">
          <div className="space-y-4">
            {sortedCategories.map((cat) => {
              const percentage = (cat.revenue / summary.total_revenue) * 100;
              return (
                <div key={cat.product_category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{cat.product_category}</span>
                    <span className="text-gray-400">{formatINR(cat.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartPanel>

        {/* Revenue by Region */}
        <ChartPanel title="Revenue by Region">
          <div className="space-y-4">
            {sortedRegions.map((region) => {
              const percentage = (region.revenue / summary.total_revenue) * 100;
              return (
                <div key={region.region}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{region.region}</span>
                    <span className="text-gray-400">{formatINR(region.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartPanel>
      </div>

      {/* Monthly Trend */}
      <ChartPanel title="Monthly Revenue Trend">
        <div className="h-64 flex items-end gap-2">
          {monthly.map((m) => {
            const maxRevenue = Math.max(...monthly.map((item) => item.revenue));
            const height = (m.revenue / maxRevenue) * 100;
            return (
              <div
                key={m.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full bg-blue-500/80 rounded-t transition-all duration-300 hover:bg-blue-400"
                  style={{ height: `${height}%` }}
                  title={`${m.month_name}: ${formatINR(m.revenue)}`}
                />
                <span className="text-xs text-gray-500">{m.month_name.slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </ChartPanel>
    </div>
  );
}
