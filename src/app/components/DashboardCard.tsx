'use client';

import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default DashboardCard;
