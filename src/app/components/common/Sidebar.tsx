'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface SidebarProps {
  items?: SidebarItem[];
  userType: 'student' | 'faculty';
  userName?: string;
  userIdentifier?: string;
}

const studentNavigation = [
  { name: 'Dashboard', href: '/student', icon: HomeIcon },
  { name: 'Assignments', href: '/student/assignments', icon: BookOpenIcon },
  { name: 'Grades', href: '/student/grades', icon: AcademicCapIcon },
  { name: 'Revaluation', href: '/student/revaluation', icon: ClipboardDocumentListIcon },
  { name: 'Profile', href: '/student/profile', icon: UserIcon },
];

const facultyNavigation = [
  { name: 'Dashboard', href: '/faculty', icon: HomeIcon },
  { name: 'Assignment Management', href: '/faculty/assignments', icon: BookOpenIcon },
  { name: 'Student Management', href: '/faculty/students', icon: UserGroupIcon },
  { name: 'TA Management', href: '/faculty/tas', icon: UserGroupIcon },
  { name: 'Grading and Feedback', href: '/faculty/grading', icon: ClipboardDocumentCheckIcon },
  { name: 'Analytics', href: '/faculty/analytics', icon: ClipboardDocumentListIcon },
  { name: 'Profile', href: '/faculty/profile', icon: UserIcon },
];

export default function Sidebar({ 
  userType, 
  userName = userType === 'faculty' ? 'Dr. John Peterson' : 'John Doe',
  userIdentifier = userType === 'faculty' ? 'Faculty' : 'STU123456',
  items = userType === 'faculty' ? facultyNavigation : studentNavigation 
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center gap-3 px-6 h-16 shrink-0 border-b border-gray-200">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
            <UserCircleIcon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-medium text-gray-900 truncate">{userName}</h2>
          <p className="text-xs text-gray-500 truncate">{userIdentifier}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4 py-4">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg
                  ${isActive 
                    ? 'bg-purple-50 text-purple-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 px-4 py-4">
          <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
