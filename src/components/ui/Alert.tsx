import React from 'react';
import { cn } from '../../utils/helpers';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-excel border px-excel-lg py-excel-md flex items-start',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon className={cn('w-5 h-5 mr-excel-md mt-0.5 flex-shrink-0', config.iconColor)} />
      
      <div className="flex-1">
        {title && (
          <h3 className={cn('text-excel-sm font-medium mb-excel-xs', config.textColor)}>
            {title}
          </h3>
        )}
        <p className={cn('text-excel-sm', config.textColor)}>
          {message}
        </p>
      </div>
      
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'ml-excel-md flex-shrink-0 p-excel-xs rounded-excel-sm hover:bg-black hover:bg-opacity-10 transition-colors',
            config.textColor
          )}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
