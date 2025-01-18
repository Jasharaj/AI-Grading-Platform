'use client';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard = ({ title, children, className = '' }: DashboardCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-purple-600 mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default DashboardCard;
