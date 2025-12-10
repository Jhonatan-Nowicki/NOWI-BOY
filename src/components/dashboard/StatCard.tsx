import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'success' | 'danger';
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default',
  delay = 0,
}: StatCardProps) {
  const variantStyles = {
    default: 'border-border/50',
    primary: 'border-primary/30 bg-primary/5',
    success: 'border-success/30 bg-success/5',
    danger: 'border-destructive/30 bg-destructive/5',
  };

  const iconStyles = {
    default: 'bg-secondary text-foreground',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-success/20 text-success',
    danger: 'bg-destructive/20 text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn('stat-card', variantStyles[variant])}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl lg:text-3xl font-display font-bold mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              {trendValue}
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconStyles[variant])}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
