import React from 'react';
import { cn } from '../../utils/helpers';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'border-excel-blue-500',
    secondary: 'border-excel-gray-500',
    white: 'border-white',
  };

  return (
    <div
      className={cn(
        'border-2 border-t-transparent rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
};

export default Loader;
