'use client';

import ResponsiveLayout from '../components/common/ResponsiveLayout';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsiveLayout role="student">
      {children}
    </ResponsiveLayout>
  );
}
