'use client';

import { motion } from 'framer-motion';
import { formatINRDetailed, formatNumber } from '@/lib/utils/format';

interface Customer {
  customer_id: number;
  total_orders: number;
  total_revenue: number;
  average_order_revenue: number;
}

interface CustomerRankingTableProps {
  data: Customer[];
}

export default function CustomerRankingTable({ data }: CustomerRankingTableProps) {
  const sorted = [...data].sort((a, b) => b.total_revenue - a.total_revenue).slice(0, 15);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">Customer Rankings</h3>
        <p className="text-xs text-gray-400 mt-0.5">Top 15 customers by total revenue</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Order</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((customer, index) => (
              <motion.tr
                key={customer.customer_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.4 + index * 0.03 }}
                className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-150"
              >
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                    index < 3 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-white font-medium">Customer {customer.customer_id}</span>
                </td>
                <td className="py-3 px-3 text-right text-gray-300">{formatNumber(customer.total_orders)}</td>
                <td className="py-3 px-3 text-right text-white font-medium">{formatINRDetailed(customer.total_revenue)}</td>
                <td className="py-3 px-3 text-right text-gray-300">{formatINRDetailed(customer.average_order_revenue)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
