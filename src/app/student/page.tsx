'use client';

import PageContainer from '../components/PageContainer';
import { AcademicCapIcon, BookOpenIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const stats = [
  { 
    name: 'Current GPA', 
    value: '3.8', 
    description: 'Out of 4.0',
    icon: ChartBarIcon,
    color: 'bg-purple-50 text-purple-700'
  },
  { 
    name: 'Active Courses', 
    value: '6', 
    description: 'Currently Enrolled',
    icon: BookOpenIcon,
    color: 'bg-blue-50 text-blue-700'
  },
  { 
    name: 'Assignments', 
    value: '4', 
    description: 'Due This Week',
    icon: ClockIcon,
    color: 'bg-orange-50 text-orange-700'
  },
  { 
    name: 'Total Credits', 
    value: '72', 
    description: 'Completed',
    icon: AcademicCapIcon,
    color: 'bg-green-50 text-green-700'
  },
];

const recentActivity = [
  {
    id: 1,
    course: 'Advanced Mathematics',
    activity: 'Assignment Graded',
    date: '2 hours ago',
    grade: 'A',
  },
  {
    id: 2,
    course: 'Computer Science 101',
    activity: 'Quiz Submitted',
    date: '1 day ago',
    grade: 'Pending',
  },
  {
    id: 3,
    course: 'Physics Fundamentals',
    activity: 'New Assignment',
    date: '2 days ago',
    grade: '-',
  },
];

export default function StudentDashboard() {
  return (
    <PageContainer
      title="Student Dashboard"
      subtitle="Welcome back! Here's an overview of your academic progress"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5"
            >
              <div className="flex items-start">
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="ml-4 w-full">
                  <p className="text-sm font-medium text-gray-600 truncate">
                    {stat.name}
                  </p>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Recent Activity
            </h3>
          </div>
          <ul role="list" className="divide-y divide-gray-100">
            {recentActivity.map((item) => (
              <li key={item.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">{item.course}</p>
                    <p className="text-sm text-gray-500">{item.activity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{item.date}</span>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                      ${item.grade === 'Pending' 
                        ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20' 
                        : item.grade === '-'
                        ? 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
                        : 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                      }`}
                    >
                      {item.grade}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <Link 
              href="/student/grades"
              className="text-sm font-medium text-purple-600 hover:text-purple-500"
            >
              View all activity
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
