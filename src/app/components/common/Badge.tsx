import React from 'react';

interface BadgeProps {
  variant: 'pending' | 'success' | 'info' | 'purple' | 'gray' | 'green' | 'blue' | 'yellow' | 'red';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  gray: 'bg-gray-100 text-gray-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-1.5 text-sm',
};

export const Badge = ({ variant, children, size = 'sm' }: BadgeProps) => {
  return (
    <span className={`${sizeStyles[size]} font-semibold rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};
