import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  color?: 'default' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const baseStyles = {
  default: {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    outline: 'border border-purple-600 text-purple-600 hover:bg-purple-50',
    text: 'text-purple-600 hover:bg-purple-50'
  },
  danger: {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-red-100 text-red-800 hover:bg-red-200',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50',
    text: 'text-red-600 hover:bg-red-50'
  },
  success: {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-green-100 text-green-800 hover:bg-green-200',
    outline: 'border border-green-600 text-green-600 hover:bg-green-50',
    text: 'text-green-600 hover:bg-green-50'
  }
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({ 
  variant = 'primary',
  color = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        ${baseStyles[color][variant]}
        ${sizeStyles[size]}
        ${variant === 'text' ? '' : 'rounded-lg'}
        font-medium
        transition-colors
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-purple-500
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
