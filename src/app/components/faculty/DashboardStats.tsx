import React from 'react';
import { Card } from '../common/Card';

interface StatsCardProps {
  title: string;
  value: number;
  colorClass: string;
}

const StatsCard = ({ title, value, colorClass }: StatsCardProps) => (
  <Card>
    <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
    <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
  </Card>
);

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Active Courses"
        value={3}
        colorClass="text-purple-600"
      />
      <StatsCard
        title="Pending Assignments"
        value={8}
        colorClass="text-purple-500"
      />
      <StatsCard
        title="Total Students"
        value={150}
        colorClass="text-purple-700"
      />
      <StatsCard
        title="Re-evaluation Requests"
        value={5}
        colorClass="text-purple-800"
      />
    </div>
  );
};
