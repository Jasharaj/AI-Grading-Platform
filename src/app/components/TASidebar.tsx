'use client';

import React from 'react';
import Sidebar from '@/app/components/common/Sidebar';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';

const taNavigation = [
  { name: 'Dashboard', href: '/TA/dashboard', icon: HomeIcon },
  { name: 'Evaluate Student', href: '/TA/evaluate', icon: ClipboardDocumentCheckIcon },
  { name: 'View Submissions', href: '/TA/submissions', icon: ClipboardDocumentListIcon },
  { name: 'AI Plagiarism Check', href: '/TA/plagiarism-check', icon: ShieldExclamationIcon },
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
