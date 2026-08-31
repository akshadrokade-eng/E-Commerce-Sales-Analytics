'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface BusinessSnapshotProps {
  avgQuantityPerOrder: number;
  avgDeliveryDays: number;
  avgCustomerRating: number;
  mostPopularPayment: string;
}

const items: Array<{ key: string; label: string; format: (v: string | number) => string }> = [
  { key: 'avgQty', label: 'Avg Quantity / Order', format: (v) => Number(v).toFixed(1) },
  { key: 'avgDelivery', label: 'Avg Delivery Days', format: (v) => Number(v).toFixed(1) },
  { key: 'avgRating', label: 'Avg Customer Rating', format: (v) => Number(v).toFixed(1) },
  { key: 'topPayment', label: 'Most Popular Payment', format: (v) => String(v) },
];

export default function BusinessSnapshot({
  avgQuantityPerOrder,
  avgDeliveryDays,
  avgCustomerRating,
  mostPopularPayment,
}: BusinessSnapshotProps) {
  const values: Record<string, string | number> = {
    avgQty: avgQuantityPerOrder,
    avgDelivery: avgDeliveryDays,
    avgRating: avgCustomerRating,
    topPayment: mostPopularPayment,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-4 h-4 text-blue-400" />
        <h3 className="text-base font-semibold text-white">Business Snapshot</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ key, label, format }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
            className="text-center p-3 bg-gray-700/20 rounded-lg"
          >
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{label}</p>
            <p className="text-lg font-bold text-white">{format(values[key])}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
