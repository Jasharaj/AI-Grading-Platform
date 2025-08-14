import React from 'react';
import { Card } from '../common/Card';
import { 
  PlusIcon, 
  EyeIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  bgGradient: string;
  href?: string;
  onClick?: () => void;
}

const QuickActionButton = ({ title, description, icon: Icon, colorClass, bgGradient, href, onClick }: QuickActionProps) => (
  <button
    onClick={onClick}
    className="group relative w-full p-4 text-left bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm hover:shadow-lg hover:border-purple-200/50 transition-all duration-300 hover:-translate-y-0.5"
  >
    {/* Background Gradient */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${bgGradient} rounded-xl transition-opacity duration-300`}></div>
    
    <div className="relative flex items-start space-x-4">
      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${bgGradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold ${colorClass} group-hover:text-purple-700 transition-colors duration-200`}>
          {title}
        </h4>
        <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-200">
          {description}
        </p>
      </div>
      
      <ArrowRightIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
    </div>
  </button>
);

export const QuickLinks = () => {
  const quickActions = [
    {
      title: "Create Assignment",
      description: "Set up new assignments for your courses",
      icon: PlusIcon,
      colorClass: "text-purple-600",
      bgGradient: "from-purple-500 to-purple-600",
      href: "/faculty/assignments"
    },
    {
      title: "Review Submissions",
      description: "Check pending student submissions",
      icon: EyeIcon,
      colorClass: "text-indigo-600", 
      bgGradient: "from-indigo-500 to-indigo-600",
      href: "/faculty/grading"
    },
    {
      title: "View Analytics",
      description: "Track performance and engagement",
      icon: ChartBarIcon,
      colorClass: "text-blue-600",
      bgGradient: "from-blue-500 to-blue-600",
      href: "/faculty/analytics"
    },
    {
      title: "Manage Students",
      description: "View and organize your students",
      icon: UserGroupIcon,
      colorClass: "text-green-600",
      bgGradient: "from-green-500 to-green-600",
      href: "/faculty/students"
    },
    {
      title: "Re-evaluation Requests",
      description: "Review pending grade appeals",
      icon: DocumentTextIcon,
      colorClass: "text-orange-600",
      bgGradient: "from-orange-500 to-orange-600",
      href: "/faculty/revaluation"
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500 mt-1">Frequently used features</p>
          </div>
          <div className="p-2 bg-purple-100 rounded-lg">
            <BellIcon className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-6 space-y-3">
        {quickActions.map((action, index) => (
          <QuickActionButton
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            colorClass={action.colorClass}
            bgGradient={action.bgGradient}
            href={action.href}
            onClick={() => {
              // Handle navigation or action
              console.log(`Navigating to ${action.href}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};
