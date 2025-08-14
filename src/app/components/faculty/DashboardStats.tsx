import React from 'react';
import { 
  AcademicCapIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
  colorClass: string;
  bgGradient: string;
}

interface DashboardStatsProps {
  stats?: {
    totalAssignments: number;
    totalSubmissions: number;
    gradedSubmissions: number;
    pendingSubmissions: number;
  };
}

const StatsCard = ({ title, value, icon: Icon, change, changeType, colorClass, bgGradient }: StatsCardProps) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
    {/* Background Gradient Overlay */}
    <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${bgGradient}`}></div>
    
    {/* Floating Animation Elements */}
    <div className="absolute -top-2 -right-2 w-20 h-20 bg-purple-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
    <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-indigo-200/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>
    
    <div className="relative p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
            changeType === 'increase' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <ArrowTrendingUpIcon className={`h-3 w-3 ${changeType === 'decrease' ? 'rotate-180' : ''}`} />
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 group-hover:text-purple-700 transition-colors">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <p className={`text-3xl font-bold ${colorClass} group-hover:scale-105 transition-transform duration-300`}>
            {value.toLocaleString()}
          </p>
          <SparklesIcon className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>
    
    {/* Hover Border Effect */}
    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-200/50 transition-all duration-300"></div>
  </div>
);

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const completionRate = stats?.totalSubmissions ? Math.round((stats.gradedSubmissions / stats.totalSubmissions) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatsCard
        title="Total Assignments"
        value={stats?.totalAssignments || 0}
        icon={AcademicCapIcon}
        colorClass="text-purple-600"
        bgGradient="from-purple-500 to-purple-600"
      />
      <StatsCard
        title="Total Submissions"
        value={stats?.totalSubmissions || 0}
        icon={ClipboardDocumentListIcon}
        colorClass="text-indigo-600"
        bgGradient="from-indigo-500 to-indigo-600"
      />
      <StatsCard
        title="Graded Submissions"
        value={stats?.gradedSubmissions || 0}
        icon={CheckCircleIcon}
        change={`${completionRate}%`}
        changeType="increase"
        colorClass="text-green-600"
        bgGradient="from-green-500 to-green-600"
      />
      <StatsCard
        title="Pending Reviews"
        value={stats?.pendingSubmissions || 0}
        icon={ExclamationTriangleIcon}
        colorClass="text-orange-600"
        bgGradient="from-orange-500 to-orange-600"
      />
    </div>
  );
};
