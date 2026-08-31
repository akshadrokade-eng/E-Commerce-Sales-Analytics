'use client';

import Header from '@/components/layout/Header';
import KPICard from '@/components/dashboard/KPICard';
import InsightCard from '@/components/dashboard/InsightCard';
import RevenueTrend from '@/components/charts/RevenueTrend';
import CategoryRevenue from '@/components/charts/CategoryRevenue';
import RegionRevenue from '@/components/charts/RegionRevenue';
import PaymentMethods from '@/components/charts/PaymentMethods';
import RelationshipPreview from '@/components/charts/RelationshipPreview';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Trophy,
  MapPin,
  CreditCard,
  Star,
  Truck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  SummaryData,
  CategoryData,
  RegionData,
  MonthlyData,
  PaymentData,
  RelationshipsData,
} from '@/types';

function formatINR(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-IN');
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [payment, setPayment] = useState<PaymentData[]>([]);
  const [relationships, setRelationships] = useState<RelationshipsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/summary.json').then((res) => res.json()),
      fetch('/data/category.json').then((res) => res.json()),
      fetch('/data/region.json').then((res) => res.json()),
      fetch('/data/monthly.json').then((res) => res.json()),
      fetch('/data/payment.json').then((res) => res.json()),
      fetch('/data/relationships.json').then((res) => res.json()),
    ])
      .then(([summaryData, categoryData, regionData, monthlyData, paymentData, relationshipsData]) => {
        setSummary(summaryData);
        setCategories(categoryData);
        setRegions(regionData);
        setMonthly(monthlyData);
        setPayment(paymentData);
        setRelationships(relationshipsData);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load dashboard data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading dashboard data...</p>
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

  // Calculate insights from data
  const topCategory = [...categories].sort((a, b) => b.revenue - a.revenue)[0];
  const topRegion = [...regions].sort((a, b) => b.revenue - a.revenue)[0];
  const topPayment = [...payment].sort((a, b) => b.orders - a.orders)[0];
  const topRatedCategory = [...categories].sort(
    (a, b) => b.average_rating - a.average_rating
  )[0];
  const avgDelivery = summary.average_delivery_days;

  return (
    <div className="space-y-8">
      <Header
        title="Dashboard"
        description="Sales, customers & operations overview"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <KPICard
          title="Total Revenue"
          value={formatINR(summary.total_revenue)}
          subtitle={`Across ${formatNumber(summary.total_orders)} orders`}
          icon={DollarSign}
          index={0}
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(summary.total_orders)}
          subtitle={`${formatNumber(summary.unique_customers)} unique customers`}
          icon={ShoppingCart}
          index={1}
        />
        <KPICard
          title="Unique Customers"
          value={formatNumber(summary.unique_customers)}
          subtitle={`${formatINR(summary.average_order_revenue)} avg order value`}
          icon={Users}
          index={2}
        />
        <KPICard
          title="Avg Order Value"
          value={formatINR(summary.average_order_revenue)}
          subtitle={`Avg quantity: ${summary.average_quantity}`}
          icon={TrendingUp}
          index={3}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <RevenueTrend data={monthly} />
        </div>
        <div>
          <PaymentMethods data={payment} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <CategoryRevenue data={categories} totalRevenue={summary.total_revenue} />
        <RegionRevenue data={regions} />
      </div>

      {/* Key Insights */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Key Insights</h3>
          <p className="text-sm text-gray-400">Highlights from the analysis</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <InsightCard
            title="Top Category"
            value={topCategory?.product_category || 'N/A'}
            subtitle={`${formatINR(topCategory?.revenue || 0)} revenue`}
            icon={Trophy}
            color="blue"
          />
          <InsightCard
            title="Top Region"
            value={topRegion?.region || 'N/A'}
            subtitle={`${formatINR(topRegion?.revenue || 0)} revenue`}
            icon={MapPin}
            color="green"
          />
          <InsightCard
            title="Top Payment"
            value={topPayment?.payment_method || 'N/A'}
            subtitle={`${topPayment?.percentage_of_orders || 0}% of orders`}
            icon={CreditCard}
            color="amber"
          />
          <InsightCard
            title="Highest Rated"
            value={topRatedCategory?.product_category || 'N/A'}
            subtitle={`${topRatedCategory?.average_rating?.toFixed(2) || 0} avg rating`}
            icon={Star}
            color="purple"
          />
          <InsightCard
            title="Avg Delivery"
            value={`${avgDelivery} days`}
            subtitle="Across all orders"
            icon={Truck}
            color="blue"
          />
        </div>
      </div>

      {/* Relationships */}
      {relationships && <RelationshipPreview correlations={relationships.correlations} />}
    </div>
  );
}
