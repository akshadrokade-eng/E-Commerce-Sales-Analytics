'use client';

import Header from '@/components/layout/Header';
import KPICard from '@/components/dashboard/KPICard';
import InsightCard from '@/components/dashboard/InsightCard';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Truck,
  Star,
  Trophy,
  MapPin,
  CreditCard,
  Calendar,
  AlertTriangle,
  Info,
  Lightbulb,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatINR, formatINRDetailed, formatNumber, formatCorrelation, getCorrelationStrength, getCorrelationDirection } from '@/lib/utils/format';

interface SummaryData {
  total_revenue: number;
  total_orders: number;
  unique_customers: number;
  average_order_revenue: number;
  average_delivery_days: number;
  average_customer_rating: number;
}

interface CategoryData {
  product_category: string;
  revenue: number;
}

interface RegionData {
  region: string;
  revenue: number;
}

interface PaymentData {
  payment_method: string;
  orders: number;
  percentage_of_orders: number;
}

interface YearlyData {
  year: number;
  revenue: number;
}

interface CustomerData {
  customer_id: number;
  total_orders: number;
  total_revenue: number;
}

interface OperationsData {
  rating_by_category: Array<{ category: string; average_rating: number }>;
  delivery_by_region: Array<{ region: string; average_delivery_days: number }>;
}

interface RelationshipsData {
  correlations: {
    quantity_revenue_correlation: number;
    discount_revenue_correlation: number;
    delivery_rating_correlation: number;
  };
}

export default function InsightsPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [payment, setPayment] = useState<PaymentData[]>([]);
  const [yearly, setYearly] = useState<YearlyData[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [operations, setOperations] = useState<OperationsData | null>(null);
  const [relationships, setRelationships] = useState<RelationshipsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/summary.json').then((res) => res.json()),
      fetch('/data/category.json').then((res) => res.json()),
      fetch('/data/region.json').then((res) => res.json()),
      fetch('/data/payment.json').then((res) => res.json()),
      fetch('/data/yearly.json').then((res) => res.json()),
      fetch('/data/customers.json').then((res) => res.json()),
      fetch('/data/operations.json').then((res) => res.json()),
      fetch('/data/relationships.json').then((res) => res.json()),
    ])
      .then(([s, c, r, p, y, cu, o, re]) => {
        setSummary(s);
        setCategories(c);
        setRegions(r);
        setPayment(p);
        setYearly(y);
        setCustomers(cu);
        setOperations(o);
        setRelationships(re);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load insights data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading insights data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-sm text-gray-400 mt-2">Please check if the data files are available.</p>
        </div>
      </div>
    );
  }

  if (!summary || !operations || !relationships) return null;

  const topCategory = [...categories].sort((a, b) => b.revenue - a.revenue)[0];
  const topRegion = [...regions].sort((a, b) => b.revenue - a.revenue)[0];
  const topPayment = [...payment].sort((a, b) => b.orders - a.orders)[0];
  const topCustomer = [...customers].sort((a, b) => b.total_revenue - a.total_revenue)[0];
  const repeatCustomers = customers.filter((c) => c.total_orders > 1).length;
  const repeatRate = (repeatCustomers / summary.unique_customers) * 100;
  const avgCustomerRevenue = summary.total_revenue / summary.unique_customers;
  const avgOrdersPerCustomer = summary.total_orders / summary.unique_customers;

  const highestYear = [...yearly].sort((a, b) => b.revenue - a.revenue)[0];
  const lowestYear = [...yearly].sort((a, b) => a.revenue - b.revenue)[0];

  const bestRatedCategory = [...operations.rating_by_category].sort(
    (a, b) => b.average_rating - a.average_rating
  )[0];
  const fastestRegion = [...operations.delivery_by_region].sort(
    (a, b) => a.average_delivery_days - b.average_delivery_days
  )[0];
  const slowestRegion = [...operations.delivery_by_region].sort(
    (a, b) => b.average_delivery_days - a.average_delivery_days
  )[0];

  const { correlations } = relationships;

  return (
    <div className="space-y-8">
      <Header
        title="Business Insights"
        subtitle="Key findings and observations from the complete e-commerce dataset"
        totalOrders={summary.total_orders}
      />

      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Executive Summary</h3>
          <p className="text-xs text-gray-400 mt-0.5">Core dataset metrics at a glance</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard title="Total Revenue" value={formatINR(summary.total_revenue)} icon={DollarSign} index={0} color="blue" />
          <KPICard title="Total Orders" value={formatNumber(summary.total_orders)} icon={ShoppingCart} index={1} color="green" />
          <KPICard title="Unique Customers" value={formatNumber(summary.unique_customers)} icon={Users} index={2} color="purple" />
          <KPICard title="Avg Order Value" value={formatINR(summary.average_order_revenue)} icon={TrendingUp} index={3} color="amber" />
          <KPICard title="Avg Delivery" value={`${summary.average_delivery_days.toFixed(1)} days`} icon={Truck} index={4} color="blue" />
          <KPICard title="Avg Rating" value={`${summary.average_customer_rating.toFixed(2)} / 5`} icon={Star} index={5} color="amber" />
        </div>
      </motion.div>

      {/* Sales Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Sales Performance</h3>
          <p className="text-xs text-gray-400 mt-0.5">Key findings from sales analysis</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400">Top Product Category</p>
            </div>
            <p className="text-lg font-bold text-white">{topCategory?.product_category}</p>
            <p className="text-[11px] text-gray-500">{formatINR(topCategory?.revenue)} revenue</p>
            <p className="text-[11px] text-gray-500 mt-1">{topCategory?.product_category} generated the highest revenue among all product categories.</p>
          </div>
          <div className="p-4 bg-gray-700/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-gray-400">Top Region</p>
            </div>
            <p className="text-lg font-bold text-white">{topRegion?.region}</p>
            <p className="text-[11px] text-gray-500">{formatINR(topRegion?.revenue)} revenue</p>
            <p className="text-[11px] text-gray-500 mt-1">{topRegion?.region} recorded the highest revenue among all regions.</p>
          </div>
          <div className="p-4 bg-gray-700/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-gray-400">Most Used Payment</p>
            </div>
            <p className="text-lg font-bold text-white">{topPayment?.payment_method}</p>
            <p className="text-[11px] text-gray-500">{formatNumber(topPayment?.orders)} orders ({topPayment?.percentage_of_orders}%)</p>
            <p className="text-[11px] text-gray-500 mt-1">{topPayment?.payment_method} was the most frequently used payment method.</p>
          </div>
        </div>
      </motion.div>

      {/* Customer Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Customer Behavior</h3>
          <p className="text-xs text-gray-400 mt-0.5">Key findings from customer analysis</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Unique Customers</p>
            <p className="text-lg font-bold text-white">{formatNumber(summary.unique_customers)}</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Repeat Customers</p>
            <p className="text-lg font-bold text-emerald-400">{formatNumber(repeatCustomers)}</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Repeat Rate</p>
            <p className="text-lg font-bold text-blue-400">{repeatRate.toFixed(2)}%</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Avg Orders / Customer</p>
            <p className="text-lg font-bold text-white">{avgOrdersPerCustomer.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Avg Customer Revenue</p>
            <p className="text-lg font-bold text-amber-400">{formatINR(avgCustomerRevenue)}</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Top Customer</p>
            <p className="text-lg font-bold text-purple-400">{formatINRDetailed(topCustomer?.total_revenue)}</p>
            <p className="text-[10px] text-gray-500">ID {topCustomer?.customer_id}</p>
          </div>
        </div>
        <div className="space-y-2">
          <InsightCard title="Repeat Purchasing" value={`${repeatCustomers} of ${summary.unique_customers}`} detail={`${repeatRate.toFixed(2)}% of customers placed more than one order.`} index={0} color="green" />
          <InsightCard title="Top Customer" value={`Customer ${topCustomer?.customer_id}`} detail={`Generated ${formatINRDetailed(topCustomer?.total_revenue)} across ${topCustomer?.total_orders} orders.`} index={1} color="blue" />
          <InsightCard title="Customer Revenue" value={`${formatINR(avgCustomerRevenue)} average`} detail="Average revenue per customer across the dataset." index={2} color="amber" />
        </div>
      </motion.div>

      {/* Operations Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Operational Performance</h3>
          <p className="text-xs text-gray-400 mt-0.5">Key findings from operations analysis</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Average Delivery</p>
            <p className="text-lg font-bold text-blue-400">{summary.average_delivery_days.toFixed(1)} days</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Fastest Region</p>
            <p className="text-lg font-bold text-emerald-400">{fastestRegion?.region}</p>
            <p className="text-[10px] text-gray-500">{fastestRegion?.average_delivery_days.toFixed(2)} days</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Slowest Region</p>
            <p className="text-lg font-bold text-amber-400">{slowestRegion?.region}</p>
            <p className="text-[10px] text-gray-500">{slowestRegion?.average_delivery_days.toFixed(2)} days</p>
          </div>
          <div className="p-3 bg-gray-700/20 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Best Rated Category</p>
            <p className="text-lg font-bold text-purple-400">{bestRatedCategory?.category}</p>
            <p className="text-[10px] text-gray-500">{bestRatedCategory?.average_rating.toFixed(2)} / 5.0</p>
          </div>
        </div>
        <div className="space-y-2">
          <InsightCard title="Fastest Region" value={`${fastestRegion?.region}`} detail={`${fastestRegion?.region} has the fastest average delivery at ${fastestRegion?.average_delivery_days.toFixed(2)} days.`} index={0} color="green" />
          <InsightCard title="Slowest Region" value={`${slowestRegion?.region}`} detail={`${slowestRegion?.region} has the slowest average delivery at ${slowestRegion?.average_delivery_days.toFixed(2)} days.`} index={1} color="amber" />
          <InsightCard title="Best Rated" value={`${bestRatedCategory?.category}`} detail={`${bestRatedCategory?.category} has the highest average rating at ${bestRatedCategory?.average_rating.toFixed(2)} / 5.0.`} index={2} color="purple" />
        </div>
      </motion.div>

      {/* Trend Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Trends</h3>
          <p className="text-xs text-gray-400 mt-0.5">Revenue trends across years</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <p className="text-xs text-gray-400">Highest-Revenue Year</p>
            </div>
            <p className="text-lg font-bold text-white">{highestYear?.year}</p>
            <p className="text-[11px] text-gray-500">{formatINR(highestYear?.revenue)} revenue</p>
          </div>
          <div className="p-4 bg-gray-700/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-gray-400">Lowest-Revenue Year</p>
            </div>
            <p className="text-lg font-bold text-white">{lowestYear?.year}</p>
            <p className="text-[11px] text-gray-500">{formatINR(lowestYear?.revenue)} revenue</p>
            <p className="text-[10px] text-gray-600 mt-1">2035 has partial data through September.</p>
          </div>
          <div className="p-4 bg-gray-700/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400">Revenue Range</p>
            </div>
            <p className="text-[11px] text-gray-300">Annual revenue ranges from {formatINR(lowestYear?.revenue)} to {formatINR(highestYear?.revenue)}.</p>
            <p className="text-[10px] text-gray-600 mt-1">Revenue shows year-to-year variation across the 2022-2035 period.</p>
          </div>
        </div>
      </motion.div>

      {/* Relationship Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Data Relationships</h3>
          <p className="text-xs text-gray-400 mt-0.5">Statistical correlations between metrics</p>
        </div>
        <div className="space-y-4">
          {[
            { key: 'quantity_revenue', label: 'Quantity \u2194 Revenue', value: correlations.quantity_revenue_correlation },
            { key: 'discount_revenue', label: 'Discount \u2194 Revenue', value: correlations.discount_revenue_correlation },
            { key: 'delivery_rating', label: 'Delivery Days \u2194 Rating', value: correlations.delivery_rating_correlation },
          ].map((item) => {
            const strength = getCorrelationStrength(item.value);
            const direction = getCorrelationDirection(item.value);
            const barWidth = Math.min(Math.abs(item.value) * 100, 100);
            const barColor = item.value > 0.1 ? 'bg-blue-500' : item.value < -0.1 ? 'bg-amber-500' : 'bg-gray-500';
            return (
              <div key={item.key} className="p-4 bg-gray-700/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <span className="text-sm font-semibold text-white font-mono">{formatCorrelation(item.value)}</span>
                </div>
                <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden mb-2">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${barWidth}%` }} />
                </div>
                <p className="text-[11px] text-gray-400">{strength} {direction.toLowerCase()} relationship</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-700/50 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-gray-500">Correlation does not imply causation. These values indicate statistical relationships only.</p>
        </div>
      </motion.div>

      {/* Key Findings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Key Findings</h3>
          <p className="text-xs text-gray-400 mt-0.5">Concise facts derived from the data</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <InsightCard title="1. Category Leader" value="Electronics" detail="Highest-revenue product category at {formatINR(topCategory?.revenue)}." index={0} color="blue" />
          <InsightCard title="2. Regional Leader" value="West" detail="Highest-revenue region at {formatINR(topRegion?.revenue)}." index={1} color="green" />
          <InsightCard title="3. Payment Leader" value="Card" detail="Most-used payment method with {formatNumber(topPayment?.orders)} orders." index={2} color="amber" />
          <InsightCard title="4. Repeat Rate" value={`${repeatRate.toFixed(2)}%`} detail="{repeatCustomers} of {summary.unique_customers} customers placed more than one order." index={3} color="green" />
          <InsightCard title="5. Quantity-Revenue" value="Positive correlation" detail="Correlation of {formatCorrelation(correlations.quantity_revenue_correlation)} between quantity and revenue." index={4} color="blue" />
          <InsightCard title="6. Delivery-Rating" value="Very weak relationship" detail="Correlation of {formatCorrelation(correlations.delivery_rating_correlation)} between delivery days and rating." index={5} color="purple" />
          <InsightCard title="7. Revenue Range" value={`${formatINR(lowestYear?.revenue)} - ${formatINR(highestYear?.revenue)}`} detail="Annual revenue spans from {lowestYear?.year} to {highestYear?.year}." index={6} color="amber" />
        </div>
      </motion.div>

      {/* Business Observations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Business Observations</h3>
          <p className="text-xs text-gray-400 mt-0.5">Concise interpretation of the findings</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Electronics represents the strongest revenue category in the dataset.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Customer purchasing behavior shows a high level of repeat ordering at {repeatRate.toFixed(2)}%.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Payment activity is concentrated around Card transactions at {topPayment?.percentage_of_orders}%.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Regional revenue is distributed across four regions, with West leading.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Delivery time alone does not show a strong linear relationship with customer rating.</p>
          </div>
        </div>
      </motion.div>

      {/* Data Limitations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Data Limitations
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Important considerations for interpreting results</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">The dataset contains {formatNumber(summary.total_orders)} orders across {formatNumber(summary.unique_customers)} customers.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Data spans from {summary.average_delivery_days > 0 ? '2022' : '2022'} to 2035, covering a synthetic or limited time range.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Customer IDs are available, but personal demographic information is not included.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Correlation analysis does not establish causation between variables.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">The dataset does not necessarily represent real-world e-commerce behavior.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Results depend on the quality and structure of the source dataset.</p>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            Possible Areas for Further Analysis
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Potential directions for deeper investigation</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Investigate why Electronics generates higher revenue than other categories.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Analyze high-value customer purchasing patterns and behavior.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Examine whether specific discount levels affect order behavior.</p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">Investigate operational factors beyond delivery time that may influence ratings.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
