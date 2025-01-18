'use client';

import Sidebar from '../components/common/Sidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar userType="student" />
        <div className="flex-1">
          <main className="py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
