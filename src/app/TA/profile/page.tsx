'use client';

import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { Badge } from '@/app/components/common/Badge';

export default function Profile() {
  const profile = {
    name: 'Alex Johnson',
    taId: 'TA2024001',
    email: 'alex.johnson@university.edu',
    department: 'Computer Science',
    joinedDate: 'January 2024',
    courses: ['CS101', 'CS202', 'CS303'],
    expertise: ['Programming', 'Data Structures', 'Databases'],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
      <Card>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              <p className="text-gray-600">Teaching Assistant</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">TA ID</h3>
                <p className="mt-1 text-gray-800">{profile.taId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-gray-800">{profile.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Department</h3>
                <p className="mt-1 text-gray-800">{profile.department}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Joined Date</h3>
                <p className="mt-1 text-gray-800">{profile.joinedDate}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned Courses</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.courses.map((course) => (
                    <Badge key={course} variant="purple">
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Areas of Expertise</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.expertise.map((skill) => (
                    <Badge key={skill} variant="gray">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button color="default">
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
