import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>}
      {children}
    </div>
  );
};
