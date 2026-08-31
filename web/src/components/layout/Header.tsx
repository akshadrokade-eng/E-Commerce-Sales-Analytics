'use client';

import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
  description?: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      {description && (
        <p className="mt-2 text-gray-400">{description}</p>
      )}
    </motion.header>
  );
}
