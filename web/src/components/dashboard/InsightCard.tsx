'use client';

import { motion } from 'framer-motion';


interface InsightCardProps {
  title: string;
  value: string;
  detail?: string;
  index?: number;
  color?: 'blue' | 'green' | 'amber' | 'purple';
}

const colorMap = {
  blue: { dot: 'bg-blue-400', value: 'text-blue-400' },
  green: { dot: 'bg-emerald-400', value: 'text-emerald-400' },
  amber: { dot: 'bg-amber-400', value: 'text-amber-400' },
  purple: { dot: 'bg-purple-400', value: 'text-purple-400' },
};

export default function InsightCard({ title, value, detail, index = 0, color = 'blue' }: InsightCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/20 transition-colors duration-200"
    >
      <div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-2 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{title}</p>
        <p className={`text-sm font-semibold mt-0.5 ${c.value}`}>{value}</p>
        {detail && <p className="text-[11px] text-gray-500 mt-0.5">{detail}</p>}
      </div>
    </motion.div>
  );
}
