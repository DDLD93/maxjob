import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, className }) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-center">
        <div className="mr-4 rounded-lg bg-primary-50 p-3 text-primary-500">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={cn(
              'flex items-center font-medium',
              trend.isPositive ? 'text-success-600' : 'text-error-600'
            )}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4" />
            )}
            {Math.abs(trend.value)}%
          </span>
          <span className="ml-1.5 text-gray-500">vs last period</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;