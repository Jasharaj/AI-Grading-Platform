import React from 'react';
import ResponsiveLayout from '../components/common/ResponsiveLayout';
import ProtectedRoute from '../components/ProtectedRoute';

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['Faculty']} redirectTo="/login">
      <ResponsiveLayout role="faculty">
        {children}
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}
