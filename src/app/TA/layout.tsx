'use client';

import React from 'react';
import ResponsiveLayout from '../components/common/ResponsiveLayout';
import ProtectedRoute from '../components/ProtectedRoute';

export default function TALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['TA']} redirectTo="/login">
      <ResponsiveLayout role="ta">
        {children}
      </ResponsiveLayout>
    </ProtectedRoute>
  );
}
