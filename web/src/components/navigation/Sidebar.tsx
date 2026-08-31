'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Sales Analytics', href: '/sales', icon: TrendingUp },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Operations', href: '/operations', icon: Settings },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600 transition-all duration-200"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            fixed top-0 left-0 z-50 h-full w-[260px] bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50
            flex flex-col
            lg:translate-x-0
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform duration-300 ease-out
          `}
        >
          {/* Brand */}
          <div className="p-5 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white tracking-tight">
                    E-COMMERCE
                  </h1>
                  <p className="text-[10px] font-medium text-blue-400 tracking-widest">
                    ANALYTICS
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-0.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 relative
                    ${isActive
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <item.icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-gray-500">Dataset loaded</p>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">
              Dashboard v1.0
            </p>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
}
