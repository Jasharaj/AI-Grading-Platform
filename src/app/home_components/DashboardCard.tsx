'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  color: string;
}

export default function DashboardCard({ title, description, icon, link, color }: DashboardCardProps) {
  return (
    <Link href={link} className="block">
      <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out">
        <div className="p-6 flex flex-col items-center">
          <div className="mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: color }}
            >
              {icon}
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
          <p className="text-black text-center">{description}</p>
        </div>
      </div>
    </Link>
  );
}
