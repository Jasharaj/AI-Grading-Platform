'use client';

import { ReactNode } from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function PageContainer({
  children,
  title,
  subtitle,
}: PageContainerProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
