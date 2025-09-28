import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, changeType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-2xl md:text-3xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {change && (
          <div className="mt-4 flex space-x-1 items-center text-sm">
            <span
              className={`font-medium ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change}
            </span>
            <span className="text-gray-500">from last week</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default StatCard;
