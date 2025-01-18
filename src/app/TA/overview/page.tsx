'use client';

import React from 'react';
import DashboardCard from '@/app/components/DashboardCard';
import StatCard from '@/app/components/StatCard';

const courses = () => {
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

  // Dummy data for quick links
  const quickLinks = [
    { id: 1, title: 'Course Materials', url: '#' },
    { id: 2, title: 'Grading Guidelines', url: '#' },
    { id: 3, title: 'Student Roster', url: '#' },
    { id: 4, title: 'Assignment Calendar', url: '#' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Course Dashboard</h1>
      
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Courses" value={stats.totalCourses} />
        <StatCard title="Total Assignments" value={stats.totalAssignments} />
        <StatCard title="Total Submissions" value={stats.totalSubmissions} />
        <StatCard title="Pending Grades" value={stats.pendingGrades} />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <DashboardCard title="Quick Links">
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="block p-2 hover:bg-purple-50 rounded-md text-gray-700 hover:text-purple-600 transition-colors"
              >
                {link.title}
              </a>
            ))}
          </div>
        </DashboardCard>

        {/* Pending Tasks */}
        <DashboardCard title="Pending Tasks">
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800 font-medium">{task.task}</p>
                  <p className="text-sm text-gray-600">{task.course}</p>
                </div>
                <span className="text-sm text-purple-600">{task.deadline}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Recent Activity */}
        <DashboardCard title="Recent Activity">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.course}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Recent Grades */}
        <DashboardCard title="Recent Grades">
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex justify-between items-start">
                <div>
                  <p className="text-gray-800 font-medium">{grade.student}</p>
                  <p className="text-sm text-gray-600">{grade.assignment} - {grade.course}</p>
                </div>
                <span className="text-sm font-medium text-green-600">{grade.grade}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Submissions Overview */}
        <DashboardCard title="Submissions Overview">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Submissions</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Graded</span>
              <span className="font-medium">37</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Review</span>
              <span className="font-medium">8</span>
            </div>
          </div>
        </DashboardCard>

        {/* Queries/Support */}
        <DashboardCard title="Student Queries">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Open Queries</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">5 New</span>
            </div>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              View All Queries
            </button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

export default courses;
