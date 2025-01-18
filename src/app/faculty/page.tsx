'use client';

import React, { useState } from 'react';
import { DashboardStats } from '@/app/components/faculty/DashboardStats';
import { QuickLinks } from '@/app/components/faculty/QuickLinks';
import { Card } from '@/app/components/common/Card';

interface Activity {
  id: string;
  type: 'submission' | 'grading';
  message: string;
  timestamp: string;
}

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'pending'>('submissions');
  
  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'submission',
      message: 'John Doe submitted Assignment 3',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'grading',
      message: 'TA Alex completed grading for CS101 Assignment',
      timestamp: '3 hours ago'
    },
    {
      id: '3',
      type: 'submission',
      message: 'Sarah Smith submitted Project Report',
      timestamp: '5 hours ago'
    }
  ];

  const pendingTasks: Activity[] = [
    {
      id: '4',
      type: 'grading',
      message: 'Review TA grading for CS102 Quiz',
      timestamp: 'Due today'
    },
    {
      id: '5',
      type: 'grading',
      message: 'Approve grade changes for Assignment 2',
      timestamp: 'Due tomorrow'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-black">Faculty Dashboard</h1>
      
      {/* Dashboard Statistics */}
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-1">
          <QuickLinks />
        </div>
        
        {/* Recent Activity with Tabs */}
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4">
              <div className="flex space-x-4 border-b">
                <button
                  className={`px-4 py-2 ${
                    activeTab === 'submissions'
                      ? 'border-b-2 border-purple-600 text-purple-600'
                      : 'text-gray-500 hover:text-purple-600'
                  }`}
                  onClick={() => setActiveTab('submissions')}
                >
                  Recent Submissions
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === 'pending'
                      ? 'border-b-2 border-purple-600 text-purple-600'
                      : 'text-gray-500 hover:text-purple-600'
                  }`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending Tasks
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {(activeTab === 'submissions' ? recentActivities : pendingTasks).map((activity) => (
                <div key={activity.id} className="border-b pb-4 last:border-b-0">
                  <p className="text-black">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
