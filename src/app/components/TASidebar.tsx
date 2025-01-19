'use client';

import React from 'react';
import Sidebar from '@/app/components/common/Sidebar';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const taNavigation = [
  { name: 'Dashboard', href: '/TA/dashboard', icon: HomeIcon },
  { name: 'Evaluate Student', href: '/TA/evaluate', icon: ClipboardDocumentCheckIcon },
  { name: 'View Submissions', href: '/TA/submissions', icon: ClipboardDocumentListIcon },
  { name: 'Profile', href: '/TA/profile', icon: UserIcon },
];

const TASidebar = () => {
  return (
    <Sidebar
      items={taNavigation}
      userType="faculty"
      userName="Teaching Assistant"
      userIdentifier="TA"
    />
  );
};

export default TASidebar;
