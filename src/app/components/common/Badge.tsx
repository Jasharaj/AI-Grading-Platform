import React from 'react';

interface BadgeProps {
  variant: 'pending' | 'success' | 'info';
  children: React.ReactNode;
}

const variantStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
};

export const Badge = ({ variant, children }: BadgeProps) => {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};
