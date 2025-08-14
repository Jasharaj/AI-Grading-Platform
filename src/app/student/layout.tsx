'use client';

import ResponsiveLayout from '../components/common/ResponsiveLayout';
import ProtectedRoute from '../components/ProtectedRoute';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['Student']} redirectTo="/login">
      <ResponsiveLayout role="student">
        {children}
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}
