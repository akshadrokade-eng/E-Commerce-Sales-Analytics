'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  index?: number;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  index = 0,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 hover:bg-gray-800/70 transition-all duration-200 cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-xs text-gray-500 truncate">{subtitle}</p>
          )}
        </div>
        <div className="p-2.5 bg-blue-500/10 rounded-lg flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
      </div>
    </motion.div>
  );
}
