'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TASidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', path: '/TA/overview' },
    { name: 'Evaluate Student', path: '/TA/evaluate' },
    { name: 'View Submissions', path: '/TA/submissions' },
    { name: 'Profile', path: '/TA/profile' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 relative left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-purple-600">TA Dashboard</h2>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.path
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              // Add logout logic here
              window.location.href = '/login';
            }}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TASidebar;
