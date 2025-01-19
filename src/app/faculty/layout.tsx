import React from 'react';
import Sidebar from '../components/common/Sidebar';

const sidebarItems = [
  { title: 'Dashboard', path: '/faculty' },
  { title: 'Assignment Management', path: '/faculty/assignments' },
  { title: 'Student Management', path: '/faculty/students' },
  { title: 'TA Management', path: '/faculty/tas' },
  { title: 'Grading and Feedback', path: '/faculty/grading' },
  { title: 'Analytics', path: '/faculty/analytics' },
  { title: 'Profile', path: '/faculty/profile' },
];

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userType="faculty" />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
