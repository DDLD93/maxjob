import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="mb-1.5 block text-sm font-medium text-secondary-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-secondary-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'block w-full rounded-md border border-secondary-200 px-4 py-2.5 text-secondary-900 placeholder-secondary-400 bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-secondary-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-error-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;