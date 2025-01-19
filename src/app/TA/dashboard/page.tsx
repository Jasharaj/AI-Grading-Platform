'use client';

import React from 'react';
import { Card } from '@/app/components/common/Card';
import { Badge } from '@/app/components/common/Badge';

const TADashboard: React.FC = () => {
  // Dummy data for statistics
  const stats = {
    totalCourses: 3,
    totalAssignments: 12,
    totalSubmissions: 45,
    pendingGrades: 8,
  };

  // Dummy data for recent activity
  const recentActivity = [
    { id: 1, action: 'Graded Assignment 3', course: 'CS101', time: '2 hours ago' },
    { id: 2, action: 'Added new assignment', course: 'CS202', time: '4 hours ago' },
    { id: 3, action: 'Updated course materials', course: 'CS303', time: '1 day ago' },
  ];

  // Dummy data for recent grades
  const recentGrades = [
    { id: 1, student: 'John Doe', assignment: 'Assignment 3', grade: '85/100', course: 'CS101' },
    { id: 2, student: 'Jane Smith', assignment: 'Project 1', grade: '92/100', course: 'CS202' },
    { id: 3, student: 'Mike Brown', assignment: 'Quiz 2', grade: '78/100', course: 'CS303' },
  ];

  // Dummy data for pending tasks
  const pendingTasks = [
    { id: 1, task: 'Grade Assignment 4', course: 'CS101', deadline: 'Tomorrow' },
    { id: 2, task: 'Review Project Submissions', course: 'CS202', deadline: 'In 2 days' },
    { id: 3, task: 'Update Grading Rubric', course: 'CS303', deadline: 'Next week' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Course Dashboard</h1>
      
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 text-lg">Total Courses</h3>
          <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalCourses}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 text-lg">Total Assignments</h3>
          <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalAssignments}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 text-lg">Total Submissions</h3>
          <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalSubmissions}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-600 text-lg">Pending Grades</h3>
          <p className="text-4xl font-bold text-red-500 mt-2">{stats.pendingGrades}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800 mb-1">{activity.action}</p>
                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">{activity.course}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Grades</h2>
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800 mb-1">{grade.student}</p>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded">{grade.assignment}</span>
                    <span className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded">{grade.course}</span>
                  </div>
                </div>
                <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">{grade.grade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks - Full Width */}
        <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Tasks</h2>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800 mb-1">{task.task}</p>
                  <span className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded">{task.course}</span>
                </div>
                <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">{task.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TADashboard;
