import React from 'react';
import { cn } from '../../utils/helpers';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-excel-base font-medium text-excel-text-primary mb-excel-md"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-excel-text-muted">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'input-excel w-full',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-excel-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-excel-sm text-excel-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-excel-sm text-excel-sm text-excel-text-muted">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
