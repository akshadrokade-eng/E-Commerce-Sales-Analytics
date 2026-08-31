'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  index?: number;
  color?: 'blue' | 'green' | 'amber' | 'purple';
}

const colorMap = {
  blue: {
    iconBg: 'bg-blue-500/10',
    iconText: 'text-blue-400',
    border: 'hover:border-blue-500/30',
    accent: 'from-blue-500/5 to-transparent',
  },
  green: {
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-400',
    border: 'hover:border-emerald-500/30',
    accent: 'from-emerald-500/5 to-transparent',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconText: 'text-amber-400',
    border: 'hover:border-amber-500/30',
    accent: 'from-amber-500/5 to-transparent',
  },
  purple: {
    iconBg: 'bg-purple-500/10',
    iconText: 'text-purple-400',
    border: 'hover:border-purple-500/30',
    accent: 'from-purple-500/5 to-transparent',
  },
};

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  index = 0,
  color = 'blue',
}: KPICardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`
        relative bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 
        ${colors.border} hover:bg-gray-800/70 
        transition-all duration-200 cursor-default overflow-hidden group
      `}
    >
      {/* Subtle gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative flex items-start justify-between">
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
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
          className={`p-2.5 ${colors.iconBg} rounded-lg flex-shrink-0`}
        >
          <Icon className={`w-5 h-5 ${colors.iconText}`} />
        </motion.div>
      </div>
    </motion.div>
  );
}
