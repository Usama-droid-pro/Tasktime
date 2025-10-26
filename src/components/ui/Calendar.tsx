import React from 'react';
import { cn } from '../../utils/helpers';
import { Calendar as CalendarIcon } from 'lucide-react';

export interface CalendarProps {
  value?: string;
  onChange?: (date: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  label,
  error,
  className,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = value || today;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-excel-base font-medium text-excel-text-primary mb-excel-md">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          onChange={handleChange}
          className={cn(
            'input-excel w-full pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <CalendarIcon className="w-4 h-4 text-excel-text-muted" />
        </div>
      </div>
      
      {error && (
        <p className="mt-excel-sm text-excel-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Calendar;
