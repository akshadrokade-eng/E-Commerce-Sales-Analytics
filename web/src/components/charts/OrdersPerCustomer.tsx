'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import { formatNumber } from '@/lib/utils/format';

interface Customer {
  customer_id: number;
  total_orders: number;
}

interface OrdersPerCustomerProps {
  data: Customer[];
}

interface OrdersBin {
  orders: string;
  customers: number;
}

function buildOrdersBins(data: Customer[]): OrdersBin[] {
  const maxOrders = Math.max(...data.map((c) => c.total_orders));
  const bins: OrdersBin[] = [];

  for (let i = 1; i <= Math.min(maxOrders, 6); i++) {
    const count = data.filter((c) => c.total_orders === i).length;
    bins.push({ orders: `${i}`, customers: count });
  }
  if (maxOrders > 6) {
    const count = data.filter((c) => c.total_orders > 6).length;
    bins.push({ orders: '7+', customers: count });
  }
  return bins;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: OrdersBin }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">{d.orders} order{d.orders !== '1' ? 's' : ''}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="text-xs text-gray-400">Customers</span>
        <span className="text-sm font-semibold text-white">{formatNumber(d.customers)}</span>
      </div>
    </div>
  );
}

export default function OrdersPerCustomer({ data }: OrdersPerCustomerProps) {
  const bins = buildOrdersBins(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Hash className="w-4 h-4 text-blue-400" />
          Orders Per Customer
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Customer purchasing frequency distribution</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="orders"
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
              label={{ value: 'Number of Orders', position: 'insideBottom', offset: -5, fill: '#6b7280', fontSize: 10 }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
            <Bar dataKey="customers" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
