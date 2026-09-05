'use client';

import Header from '@/components/layout/Header';
import KPICard from '@/components/dashboard/KPICard';
import InsightCard from '@/components/dashboard/InsightCard';
import RevenueTrend from '@/components/charts/RevenueTrend';
import CategoryRevenue from '@/components/charts/CategoryRevenue';
import RegionRevenue from '@/components/charts/RegionRevenue';
import PaymentMethods from '@/components/charts/PaymentMethods';
import YearlyRevenue from '@/components/charts/YearlyRevenue';
import DatasetGuard from '@/components/dashboard/DatasetGuard';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Hash,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  SummaryData,
  CategoryData,
  RegionData,
  MonthlyData,
  PaymentData,
  YearlyData,
} from '@/types';
import { formatINR, formatNumber } from '@/lib/utils/format';

function SalesContent() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [payment, setPayment] = useState<PaymentData[]>([]);
  const [yearly, setYearly] = useState<YearlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/summary.json').then((res) => res.json()),
      fetch('/data/category.json').then((res) => res.json()),
      fetch('/data/region.json').then((res) => res.json()),
      fetch('/data/monthly.json').then((res) => res.json()),
      fetch('/data/payment.json').then((res) => res.json()),
      fetch('/data/yearly.json').then((res) => res.json()),
    ])
      .then(([summaryData, categoryData, regionData, monthlyData, paymentData, yearlyData]) => {
        setSummary(summaryData);
        setCategories(categoryData);
        setRegions(regionData);
        setMonthly(monthlyData);
        setPayment(paymentData);
        setYearly(yearlyData);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load sales data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-sm text-gray-400 mt-2">
            Please check if the data files are available.
          </p>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const topCategory = [...categories].sort((a, b) => b.revenue - a.revenue)[0];
  const topRegion = [...regions].sort((a, b) => b.revenue - a.revenue)[0];
  const topPayment = [...payment].sort((a, b) => b.orders - a.orders)[0];

  return (
    <div className="space-y-8">
      <Header
        title="Sales Analytics"
        subtitle="Detailed analysis of revenue, orders, products and regional performance"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatINR(summary.total_revenue)}
          subtitle={`${formatNumber(summary.total_orders)} orders`}
          icon={DollarSign}
          index={0}
          color="blue"
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(summary.total_orders)}
          subtitle={`${formatNumber(summary.unique_customers)} customers`}
          icon={ShoppingCart}
          index={1}
          color="green"
        />
        <KPICard
          title="Avg Order Value"
          value={formatINR(summary.average_order_revenue)}
          subtitle="Per order"
          icon={TrendingUp}
          index={2}
          color="purple"
        />
        <KPICard
          title="Total Quantity"
          value={formatNumber(summary.total_quantity)}
          subtitle="Items sold"
          icon={Package}
          index={3}
          color="amber"
        />
        <KPICard
          title="Avg Qty / Order"
          value={summary.average_quantity.toFixed(1)}
          subtitle="Items per order"
          icon={Hash}
          index={4}
          color="blue"
        />
        <KPICard
          title="Unique Customers"
          value={formatNumber(summary.unique_customers)}
          subtitle="Across dataset"
          icon={Users}
          index={5}
          color="green"
        />
      </div>

      {/* Revenue Trend */}
      <RevenueTrend data={monthly} />

      {/* Category + Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <CategoryRevenue data={categories} />
        <PaymentMethods data={payment} totalOrders={summary.total_orders} />
      </div>

      {/* Regional + Yearly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <RegionRevenue data={regions} />
        <YearlyRevenue data={yearly} />
      </div>

      {/* Sales Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Sales Summary</h3>
          <p className="text-xs text-gray-400 mt-0.5">Key performance indicators at a glance</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-3 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Top Category</p>
            <p className="text-lg font-bold text-blue-400">{topCategory?.product_category}</p>
            <p className="text-[11px] text-gray-500">{formatINR(topCategory?.revenue)} revenue</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Top Region</p>
            <p className="text-lg font-bold text-emerald-400">{topRegion?.region}</p>
            <p className="text-[11px] text-gray-500">{formatINR(topRegion?.revenue)} revenue</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Most Used Payment</p>
            <p className="text-lg font-bold text-amber-400">{topPayment?.payment_method}</p>
            <p className="text-[11px] text-gray-500">{formatNumber(topPayment?.orders)} orders</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Avg Order Value</p>
            <p className="text-lg font-bold text-purple-400">{formatINR(summary.average_order_revenue)}</p>
            <p className="text-[11px] text-gray-500">Per order</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Total Quantity</p>
            <p className="text-lg font-bold text-blue-400">{formatNumber(summary.total_quantity)}</p>
            <p className="text-[11px] text-gray-500">Items sold</p>
          </div>
        </div>
      </motion.div>

      {/* Sales Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Sales Insights</h3>
          <p className="text-xs text-gray-400 mt-0.5">Data-driven observations</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <InsightCard
            title="Category Leadership"
            value={`${topCategory?.product_category} leads`}
            detail={`${formatINR(topCategory?.revenue)} in revenue, the highest among all categories.`}
            index={0}
            color="blue"
          />
          <InsightCard
            title="Regional Performance"
            value={`${topRegion?.region} region on top`}
            detail={`${formatINR(topRegion?.revenue)} in revenue, the strongest regional performer.`}
            index={1}
            color="green"
          />
          <InsightCard
            title="Payment Preference"
            value={`Card is the most used`}
            detail={`${formatNumber(topPayment?.orders)} orders (${topPayment?.percentage_of_orders}%) use Card payments.`}
            index={2}
            color="amber"
          />
          <InsightCard
            title="Dataset Coverage"
            value="14 years of data"
            detail={`From ${summary.date_range_start} to ${summary.date_range_end}, covering ${formatNumber(summary.total_orders)} orders.`}
            index={3}
            color="purple"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function SalesPage() {
  return (
    <DatasetGuard>
      <SalesContent />
    </DatasetGuard>
  );
}
