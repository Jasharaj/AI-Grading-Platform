'use client';

import React from 'react';
import ResponsiveLayout from '../components/common/ResponsiveLayout';

export default function TALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsiveLayout role="ta">
      {children}
    </ResponsiveLayout>
  );
}
