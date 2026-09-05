'use client';

import Header from '@/components/layout/Header';
import KPICard from '@/components/dashboard/KPICard';
import InsightCard from '@/components/dashboard/InsightCard';
import CustomerRevenueChart from '@/components/charts/CustomerRevenueChart';
import OrdersPerCustomer from '@/components/charts/OrdersPerCustomer';
import CustomerRankingTable from '@/components/dashboard/CustomerRankingTable';
import DatasetGuard from '@/components/dashboard/DatasetGuard';
import {
  Users,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  Percent,
  DollarSign,
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatINR, formatINRDetailed, formatNumber } from '@/lib/utils/format';

interface Customer {
  customer_id: number;
  total_orders: number;
  total_revenue: number;
  total_quantity: number;
  average_order_revenue: number;
  average_rating: number;
  average_delivery_days: number;
}

interface SummaryData {
  total_revenue: number;
  total_orders: number;
  unique_customers: number;
  average_order_revenue: number;
  total_quantity: number;
}

function CustomersContent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/customers.json').then((res) => res.json()),
      fetch('/data/summary.json').then((res) => res.json()),
    ])
      .then(([customersData, summaryData]) => {
        setCustomers(customersData);
        setSummary(summaryData);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load customer data.');
        setLoading(false);
      });
  }, []);

  const metrics = useMemo(() => {
    if (customers.length === 0 || !summary) return null;

    const uniqueCustomers = summary.unique_customers;
    const totalOrders = summary.total_orders;
    const avgOrdersPerCustomer = totalOrders / uniqueCustomers;

    const repeatCustomers = customers.filter((c) => c.total_orders > 1).length;
    const repeatPercent = (repeatCustomers / uniqueCustomers) * 100;

    const avgCustomerRevenue = summary.total_revenue / uniqueCustomers;

    const topCustomer = [...customers].sort((a, b) => b.total_revenue - a.total_revenue)[0];

    // Revenue segments using terciles
    const sorted = [...customers].sort((a, b) => a.total_revenue - b.total_revenue);
    const tercileIndex = Math.floor(sorted.length / 3);
    const lowThreshold = sorted[tercileIndex]?.total_revenue || 0;
    const highThreshold = sorted[tercileIndex * 2]?.total_revenue || 0;

    const lowValue = customers.filter((c) => c.total_revenue <= lowThreshold);
    const mediumValue = customers.filter((c) => c.total_revenue > lowThreshold && c.total_revenue <= highThreshold);
    const highValue = customers.filter((c) => c.total_revenue > highThreshold);

    const lowRevenue = lowValue.reduce((sum, c) => sum + c.total_revenue, 0);
    const mediumRevenue = mediumValue.reduce((sum, c) => sum + c.total_revenue, 0);
    const highRevenue = highValue.reduce((sum, c) => sum + c.total_revenue, 0);

    return {
      uniqueCustomers,
      totalOrders,
      avgOrdersPerCustomer,
      repeatCustomers,
      repeatPercent,
      avgCustomerRevenue,
      topCustomer,
      segments: {
        low: { count: lowValue.length, revenue: lowRevenue, threshold: lowThreshold },
        medium: { count: mediumValue.length, revenue: mediumRevenue, threshold: highThreshold },
        high: { count: highValue.length, revenue: highRevenue },
      },
    };
  }, [customers, summary]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading customer data...</p>
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

  if (!summary || !metrics) return null;

  return (
    <div className="space-y-8">
      <Header
        title="Customer Analytics"
        subtitle="Customer purchasing behavior, loyalty and revenue analysis"
        totalOrders={summary.total_orders}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Unique Customers"
          value={formatNumber(metrics.uniqueCustomers)}
          subtitle="Across dataset"
          icon={Users}
          index={0}
          color="blue"
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(metrics.totalOrders)}
          subtitle="All customer orders"
          icon={ShoppingCart}
          index={1}
          color="green"
        />
        <KPICard
          title="Avg Orders / Customer"
          value={metrics.avgOrdersPerCustomer.toFixed(2)}
          subtitle="Per customer"
          icon={TrendingUp}
          index={2}
          color="purple"
        />
        <KPICard
          title="Repeat Customers"
          value={formatNumber(metrics.repeatCustomers)}
          subtitle="With 2+ orders"
          icon={UserCheck}
          index={3}
          color="green"
        />
        <KPICard
          title="Repeat Customer %"
          value={`${metrics.repeatPercent.toFixed(2)}%`}
          subtitle="Of all customers"
          icon={Percent}
          index={4}
          color="amber"
        />
        <KPICard
          title="Avg Customer Revenue"
          value={formatINR(metrics.avgCustomerRevenue)}
          subtitle="Per customer"
          icon={DollarSign}
          index={5}
          color="blue"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <CustomerRevenueChart data={customers} />
        <OrdersPerCustomer data={customers} />
      </div>

      {/* Customer Segments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Customer Revenue Segments</h3>
          <p className="text-xs text-gray-400 mt-0.5">Tercile-based segmentation by total revenue</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Low Value</p>
            <p className="text-lg font-bold text-blue-400">{formatNumber(metrics.segments.low.count)} customers</p>
            <p className="text-[11px] text-gray-500">{formatINR(metrics.segments.low.revenue)} revenue</p>
            <p className="text-[10px] text-gray-600 mt-1">≤ {formatINR(metrics.segments.low.threshold)} total</p>
          </div>
          <div className="p-4 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Medium Value</p>
            <p className="text-lg font-bold text-amber-400">{formatNumber(metrics.segments.medium.count)} customers</p>
            <p className="text-[11px] text-gray-500">{formatINR(metrics.segments.medium.revenue)} revenue</p>
            <p className="text-[10px] text-gray-600 mt-1">≤ {formatINR(metrics.segments.medium.threshold)} total</p>
          </div>
          <div className="p-4 bg-gray-700/20 rounded-lg">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">High Value</p>
            <p className="text-lg font-bold text-emerald-400">{formatNumber(metrics.segments.high.count)} customers</p>
            <p className="text-[11px] text-gray-500">{formatINR(metrics.segments.high.revenue)} revenue</p>
            <p className="text-[10px] text-gray-600 mt-1">&gt; {formatINR(metrics.segments.medium.threshold)} total</p>
          </div>
        </div>
      </motion.div>

      {/* Customer Rankings Table */}
      <CustomerRankingTable data={customers} />

      {/* Customer Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Customer Insights</h3>
          <p className="text-xs text-gray-400 mt-0.5">Data-driven observations</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <InsightCard
            title="Repeat Purchasing"
            value={`${metrics.repeatPercent.toFixed(2)}% repeat rate`}
            detail={`${formatNumber(metrics.repeatCustomers)} of ${formatNumber(metrics.uniqueCustomers)} customers made more than one purchase.`}
            index={0}
            color="green"
          />
          <InsightCard
            title="Top Customer"
            value={`Customer ${metrics.topCustomer?.customer_id}`}
            detail={`Generated ${formatINRDetailed(metrics.topCustomer?.total_revenue)} across ${metrics.topCustomer?.total_orders} orders.`}
            index={1}
            color="blue"
          />
          <InsightCard
            title="Order Frequency"
            value={`${metrics.avgOrdersPerCustomer.toFixed(2)} avg orders`}
            detail={`Customers average ${metrics.avgOrdersPerCustomer.toFixed(2)} orders across the dataset.`}
            index={2}
            color="amber"
          />
          <InsightCard
            title="Revenue Concentration"
            value={`${formatNumber(metrics.segments.high.count)} high-value`}
            detail={`The top tercile of customers generated ${formatINR(metrics.segments.high.revenue)} in total revenue.`}
            index={3}
            color="purple"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <DatasetGuard>
      <CustomersContent />
    </DatasetGuard>
  );
}
