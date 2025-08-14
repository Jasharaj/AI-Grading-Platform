'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';
import { 
  UserIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BellIcon,
  ShieldCheckIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

export default function FacultyProfile() {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCourses: 0,
    totalStudents: 0,
    yearsTeaching: 0
  });
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: 'Computer Science',
    position: 'Professor',
    phone: '+1 (555) 123-4567',
    office: 'Room 302, Computer Science Building',
    joinDate: '2015-08-15',
    bio: 'Dedicated faculty member with expertise in computer science and passion for education.',
    specializations: ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Neural Networks']
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    gradeNotifications: false,
    assignmentReminders: true,
    weeklyReports: true
  });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
      fetchProfileStats();
    }
  }, [user]);

  const fetchProfileStats = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      
      // Fetch courses
      const coursesResponse = await fetch(`${BASE_URL}/faculty/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch students
      const studentsResponse = await fetch(`${BASE_URL}/students/getAllStudents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const coursesData = await coursesResponse.json();
      const studentsData = await studentsResponse.json();

      setStats({
        activeCourses: coursesData.success ? coursesData.data.length : 0,
        totalStudents: studentsData.success ? studentsData.data.length : 0,
        yearsTeaching: Math.floor((Date.now() - new Date('2015-08-15').getTime()) / (1000 * 60 * 60 * 24 * 365))
      });
    } catch (error) {
      console.error('Error fetching profile stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // Here you would typically save to backend
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset profile data if needed
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 25%, white 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <UserIcon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-purple-100 mt-1">{profile.position}</p>
                <p className="text-purple-200 text-sm">{profile.department} Department</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 border border-white/30"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 border border-white/30 shadow-lg"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <PencilIcon className="h-5 w-5" />
                  <span className="font-medium">Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2">
        <div className="flex space-x-1">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'profile'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon className="h-4 w-4" />
            <span>Profile Information</span>
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'preferences'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            <BellIcon className="h-4 w-4" />
            <span>Preferences</span>
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'security'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Security</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-purple-600" />
                <span>Basic Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isEditing 
                        ? 'border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white' 
                        : 'border-transparent bg-gray-50 text-gray-700'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={profile.position}
                    onChange={(e) => setProfile({...profile, position: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isEditing 
                        ? 'border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white' 
                        : 'border-transparent bg-gray-50 text-gray-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isEditing 
                        ? 'border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white' 
                        : 'border-transparent bg-gray-50 text-gray-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({...profile, department: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isEditing 
                        ? 'border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white' 
                        : 'border-transparent bg-gray-50 text-gray-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isEditing 
                        ? 'border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white' 
                        : 'border-transparent bg-gray-50 text-gray-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Office Location</label>
                  <input
                    type="text"
                    value={profile.office}
                    onChange={(e) => setProfile({...profile, office: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                      isEditing 
                        ? 'border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white' 
                        : 'border-transparent bg-gray-50 text-gray-700'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Biography</h3>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                disabled={!isEditing}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none ${
                  isEditing 
                    ? 'border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white' 
                    : 'border-transparent bg-gray-50 text-gray-700'
                }`}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Active Courses</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{loading ? '...' : stats.activeCourses}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Total Students</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{loading ? '...' : stats.totalStudents}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Years Teaching</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{loading ? '...' : stats.yearsTeaching}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profile.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profile.office}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <BuildingLibraryIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profile.department}</span>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h3>
          <div className="space-y-6">
            {Object.entries(preferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {key === 'emailNotifications' && 'Receive general email notifications'}
                    {key === 'gradeNotifications' && 'Get notified when grades are posted'}
                    {key === 'assignmentReminders' && 'Receive assignment deadline reminders'}
                    {key === 'weeklyReports' && 'Get weekly performance reports'}
                  </p>
                </div>
                <button
                  onClick={() => setPreferences({...preferences, [key]: !value})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    value ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <KeyIcon className="h-5 w-5 text-purple-600" />
              <span>Password & Security</span>
            </h3>
            
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Change Password</h4>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
              </button>
              
              <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
