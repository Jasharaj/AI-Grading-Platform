'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiUser, FiBook, FiAward } from 'react-icons/fi';
import { IoSchoolOutline } from 'react-icons/io5';

interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: string;
  gpa: number;
  enrolledCourses: number;
  completedCredits: number;
  totalCredits: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    studentId: 'STU123456',
    major: 'Computer Science',
    year: 'Third Year',
    gpa: 3.8,
    enrolledCourses: 5,
    completedCredits: 90,
    totalCredits: 120
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        {showNotification && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Profile updated successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-50 mx-auto bg-gray-100 flex items-center justify-center">
                  <FiUser className="w-16 h-16 text-gray-400" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500">{profile.studentId}</p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-600">{profile.gpa}</div>
                    <div className="text-sm text-gray-600">GPA</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-600">{profile.enrolledCourses}</div>
                    <div className="text-sm text-gray-600">Courses</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Academic Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Credits Completed</span>
                      <span>{profile.completedCredits}/{profile.totalCredits}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(profile.completedCredits / profile.totalCredits) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
              {/* Personal Information */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-purple-600" />
                    Personal Information
                  </h3>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: isEditing ? '#7C3AED' : '#F3F4F6',
                      color: isEditing ? 'white' : '#374151'
                    }}
                  >
                    {isEditing ? 'Save Changes' : 'Edit'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-gray-900 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-gray-900 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-6">
                  <IoSchoolOutline className="w-5 h-5 text-purple-600" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                    <input
                      type="text"
                      value={profile.major}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-gray-900 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select
                      value={profile.year}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-gray-900 disabled:bg-gray-50"
                    >
                      <option>First Year</option>
                      <option>Second Year</option>
                      <option>Third Year</option>
                      <option>Fourth Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-6">
                  <FiAward className="w-5 h-5 text-purple-600" />
                  Achievements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiAward className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Dean's List</div>
                      <div className="text-sm text-gray-500">Fall 2024</div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiBook className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Perfect Attendance</div>
                      <div className="text-sm text-gray-500">Spring 2024</div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiAward className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Top Performer</div>
                      <div className="text-sm text-gray-500">CS301</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
