import React from 'react';
import ResponsiveLayout from '../components/common/ResponsiveLayout';

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsiveLayout role="faculty">
      {children}
    </ResponsiveLayout>
  );
}
