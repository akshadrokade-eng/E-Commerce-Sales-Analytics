'use client';

import Header from '@/components/layout/Header';
import KPICard from '@/components/dashboard/KPICard';
import InsightCard from '@/components/dashboard/InsightCard';
import DeliveryByRegion from '@/components/charts/DeliveryByRegion';
import DeliveryDistribution from '@/components/charts/DeliveryDistribution';
import RatingDistribution from '@/components/charts/RatingDistribution';
import CategoryRating from '@/components/charts/CategoryRating';
import DeliveryRatingScatter from '@/components/charts/DeliveryRatingScatter';
import {
  Truck,
  Star,
  ShoppingCart,
  Zap,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatNumber } from '@/lib/utils/format';

interface OperationsData {
  delivery_distribution: Array<{ days: number; count: number }>;
  delivery_by_region: Array<{ region: string; average_delivery_days: number }>;
  delivery_by_category: Array<{ category: string; average_delivery_days: number }>;
  rating_distribution: Array<{ rating: number; count: number }>;
  rating_by_category: Array<{ category: string; average_rating: number }>;
  rating_by_region: Array<{ region: string; average_rating: number }>;
}

interface RelationshipsData {
  delivery_days_vs_rating: Array<{ delivery_days: number; customer_rating: number }>;
  correlations: {
    delivery_rating_correlation: number;
  };
}

interface SummaryData {
  total_orders: number;
  unique_customers: number;
  average_delivery_days: number;
  average_customer_rating: number;
}

export default function OperationsPage() {
  const [operations, setOperations] = useState<OperationsData | null>(null);
  const [relationships, setRelationships] = useState<RelationshipsData | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/operations.json').then((res) => res.json()),
      fetch('/data/relationships.json').then((res) => res.json()),
      fetch('/data/summary.json').then((res) => res.json()),
    ])
      .then(([operationsData, relationshipsData, summaryData]) => {
        setOperations(operationsData);
        setRelationships(relationshipsData);
        setSummary(summaryData);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load operations data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading operations data...</p>
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

  if (!operations || !summary || !relationships) return null;

  // Calculate derived metrics
  const fastestDelivery = Math.min(...operations.delivery_distribution.map((d) => d.days));
  const slowestDelivery = Math.max(...operations.delivery_distribution.map((d) => d.days));

  const fastestRegion = [...operations.delivery_by_region].sort(
    (a, b) => a.average_delivery_days - b.average_delivery_days
  )[0];
  const slowestRegion = [...operations.delivery_by_region].sort(
    (a, b) => b.average_delivery_days - a.average_delivery_days
  )[0];

  const bestRatedCategory = [...operations.rating_by_category].sort(
    (a, b) => b.average_rating - a.average_rating
  )[0];

  return (
    <div className="space-y-8">
      <Header
        title="Operations Analytics"
        subtitle="Delivery performance, customer satisfaction and operational trends"
        totalOrders={summary.total_orders}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Avg Delivery Days"
          value={`${summary.average_delivery_days.toFixed(1)} days`}
          subtitle="Across all orders"
          icon={Truck}
          index={0}
          color="blue"
        />
        <KPICard
          title="Avg Customer Rating"
          value={`${summary.average_customer_rating.toFixed(2)} / 5`}
          subtitle="Across all orders"
          icon={Star}
          index={1}
          color="amber"
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(summary.total_orders)}
          subtitle="Delivered orders"
          icon={ShoppingCart}
          index={2}
          color="green"
        />
        <KPICard
          title="Fastest Delivery"
          value={`${fastestDelivery} day${fastestDelivery !== 1 ? 's' : ''}`}
          subtitle="Minimum delivery time"
          icon={Zap}
          index={3}
          color="green"
        />
        <KPICard
          title="Slowest Delivery"
          value={`${slowestDelivery} days`}
          subtitle="Maximum delivery time"
          icon={AlertTriangle}
          index={4}
          color="amber"
        />
        <KPICard
          title="Total Customers"
          value={formatNumber(summary.unique_customers)}
          subtitle="Unique customers"
          icon={Users}
          index={5}
          color="purple"
        />
      </div>

      {/* Delivery by Region + Delivery Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <DeliveryByRegion data={operations.delivery_by_region} />
        <DeliveryDistribution data={operations.delivery_distribution} />
      </div>

      {/* Rating Distribution + Category Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <RatingDistribution data={operations.rating_distribution} />
        <CategoryRating data={operations.rating_by_category} />
      </div>

      {/* Delivery vs Rating Scatter */}
      <DeliveryRatingScatter
        data={relationships.delivery_days_vs_rating}
        correlation={relationships.correlations.delivery_rating_correlation}
      />

      {/* Regional Operations Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Regional Operations Summary</h3>
          <p className="text-xs text-gray-400 mt-0.5">Key operational metrics by region and category</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Fastest Region</p>
            <p className="text-lg font-bold text-emerald-400">{fastestRegion?.region}</p>
            <p className="text-[11px] text-gray-500">{fastestRegion?.average_delivery_days.toFixed(2)} days avg</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Slowest Region</p>
            <p className="text-lg font-bold text-amber-400">{slowestRegion?.region}</p>
            <p className="text-[11px] text-gray-500">{slowestRegion?.average_delivery_days.toFixed(2)} days avg</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Best Rated Category</p>
            <p className="text-lg font-bold text-purple-400">{bestRatedCategory?.category}</p>
            <p className="text-[11px] text-gray-500">{bestRatedCategory?.average_rating.toFixed(2)} / 5.0</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Average Delivery</p>
            <p className="text-lg font-bold text-blue-400">{summary.average_delivery_days.toFixed(1)} days</p>
            <p className="text-[11px] text-gray-500">Overall average</p>
          </div>
        </div>
      </motion.div>

      {/* Operational Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Operational Insights</h3>
          <p className="text-xs text-gray-400 mt-0.5">Data-driven observations</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <InsightCard
            title="Delivery Time"
            value={`${summary.average_delivery_days.toFixed(1)} days average`}
            detail="Average delivery time across the dataset ranges from 1 to 11 days."
            index={0}
            color="blue"
          />
          <InsightCard
            title="Fastest Region"
            value={`${fastestRegion?.region} region`}
            detail={`${fastestRegion?.region} has the fastest average delivery at ${fastestRegion?.average_delivery_days.toFixed(2)} days.`}
            index={1}
            color="green"
          />
          <InsightCard
            title="Slowest Region"
            value={`${slowestRegion?.region} region`}
            detail={`${slowestRegion?.region} has the slowest average delivery at ${slowestRegion?.average_delivery_days.toFixed(2)} days.`}
            index={2}
            color="amber"
          />
          <InsightCard
            title="Top Rated Category"
            value={`${bestRatedCategory?.category}`}
            detail={`${bestRatedCategory?.category} has the highest average rating at ${bestRatedCategory?.average_rating.toFixed(2)} / 5.0.`}
            index={3}
            color="purple"
          />
        </div>
      </motion.div>
    </div>
  );
}
