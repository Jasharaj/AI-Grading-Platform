import React from 'react';
import { Card } from '../common/Card';

interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: 'submission' | 'grading' | 'notification';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    message: 'New assignment submission from John Doe',
    timestamp: '2 hours ago',
    type: 'submission'
  },
  {
    id: '2',
    message: 'TA Alex completed grading for Assignment #3',
    timestamp: '5 hours ago',
    type: 'grading'
  },
  {
    id: '3',
    message: 'Re-evaluation request from Sarah Smith',
    timestamp: '1 day ago',
    type: 'notification'
  }
];

export const RecentActivity = () => {
  return (
    <Card title="Recent Activity">
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="border-b pb-4 last:border-b-0">
            <p className="text-black">{activity.message}</p>
            <p className="text-sm text-gray-500">{activity.timestamp}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
