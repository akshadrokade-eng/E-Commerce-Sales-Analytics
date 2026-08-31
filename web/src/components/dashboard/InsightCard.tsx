'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'purple';
}

const colorMap = {
  blue: 'bg-blue-500/10 text-blue-400',
  green: 'bg-emerald-500/10 text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-400',
  purple: 'bg-purple-500/10 text-purple-400',
};

export default function InsightCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
}: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4 hover:border-gray-600/50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-1 text-lg font-bold text-white truncate">{value}</p>
          <p className="mt-0.5 text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
