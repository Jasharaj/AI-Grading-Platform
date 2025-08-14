'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { BASE_URL } from '@/app/config';
import { 
  UserIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  PencilIcon, 
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon,
  UsersIcon,
  TrophyIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/components/common/Button';

interface TAProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  office?: string;
  officeHours?: string;
  department?: string;
  expertise?: string[];
  stats: {
    totalAssigned: number;
    totalGraded: number;
    pendingGrades: number;
    averageGrade: string;
    courses: string[];
  };
  joinedDate: string;
  achievements?: Array<{
    name: string;
    description: string;
  }>;
}

export default function TAProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<TAProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    office: '',
    officeHours: '',
    department: '',
    expertise: [] as string[]
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/ta/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        // Initialize form data with profile data
        setFormData({
          phone: data.data.phone || '',
          office: data.data.office || '',
          officeHours: data.data.officeHours || '',
          department: data.data.department || '',
          expertise: data.data.expertise || []
        });
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${BASE_URL}/ta/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(prev => prev ? { ...prev, ...formData } : null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const achievements = profile?.achievements || [
    { name: 'Quick Responder', description: 'Average response time < 2 hours' },
    { name: 'Grading Expert', description: `Completed ${profile?.stats.totalGraded || 0}+ assignments` },
    { name: 'Excellence Award', description: 'Outstanding TA performance' },
  ];

  const achievementIcons = [ClockIcon, AcademicCapIcon, TrophyIcon, StarIcon];
  const achievementColors = [
    'bg-green-100 text-green-800',
    'bg-blue-100 text-blue-800', 
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <div className="text-red-600 mb-2">⚠️ Error Loading Profile</div>
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={() => {
                setError('');
                setLoading(true);
                fetchProfile();
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 text-white mb-8 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-4 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-lg animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">TA Profile</h1>
                <p className="text-xl text-indigo-100 mt-2">Manage your profile, view achievements, and track your teaching performance</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="hidden sm:inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Office</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.office}
                        onChange={(e) => setFormData({...formData, office: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter office location"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{profile.office || 'Not specified'}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Office Hours</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.officeHours}
                        onChange={(e) => setFormData({...formData, officeHours: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Mon-Fri 2-4 PM"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{profile.officeHours || 'Not specified'}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Department</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter department"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{profile.department || 'Not specified'}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-medium text-gray-900">{new Date(profile.joinedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Courses & Expertise</h2>
                <BookOpenIcon className="h-6 w-6 text-green-600" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-3">Assigned Courses</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.stats.courses && profile.stats.courses.length > 0 ? (
                      profile.stats.courses.map((course: string) => (
                        <span key={course} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {course}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        No courses assigned
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-3">Areas of Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise && profile.expertise.length > 0 ? (
                      profile.expertise.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        Not specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <UsersIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{profile.stats.totalAssigned}</div>
                <div className="text-sm text-blue-600">Total Assignments</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{profile.stats.totalGraded}</div>
                <div className="text-sm text-green-600">Assignments Graded</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                <StarIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-900">{profile.stats.averageGrade}</div>
                <div className="text-sm text-yellow-600">Average Grade</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <ClockIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">{profile.stats.pendingGrades}</div>
                <div className="text-sm text-purple-600">Pending Grades</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Achievements & Recognition</h2>
              <TrophyIcon className="h-6 w-6 text-yellow-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievementIcons[index] || TrophyIcon;
                const colorClass = achievementColors[index] || 'bg-gray-100 text-gray-800';
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleProfileUpdate}
                  disabled={updating}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>{updating ? 'Saving...' : 'Save Changes'}</span>
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)}
                  disabled={updating}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700"
                >
                  <span>Cancel</span>
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            )}
            
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              View Public Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
