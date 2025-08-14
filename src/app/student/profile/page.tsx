'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import { 
  UserIcon, 
  CameraIcon, 
  PencilIcon, 
  CheckIcon,
  XMarkIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
  CalendarIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChartBarIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: string;
  gpa: number;
  completedCredits: number;
  totalCredits: number;
  phone?: string;
  address?: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  averageGrade: number;
  statistics?: {
    totalSubmissions: number;
    gradedAssignments: number;
    averageGrade: number;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    major: '',
    year: ''
  });

  const fetchProfile = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token found and this is the first attempt, wait a bit for auth context
        if (retryCount === 0) {
          setTimeout(() => fetchProfile(1), 1000);
          return;
        }
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching profile data...');
      
      const response = await fetch(`${BASE_URL}/students/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile data received:', data);
      
      if (!data.success || !data.data) {
        throw new Error('Invalid profile data received');
      }
      
      setProfile(data.data);
      
      // Initialize edit form with current data
      setEditForm({
        name: data.data.name || '',
        email: data.data.email || '',
        phone: data.data.phone || '',
        address: data.data.address || '',
        major: data.data.major || '',
        year: data.data.year || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure localStorage and auth context are ready
    const timer = setTimeout(() => {
      fetchProfile();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const updateProfile = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/students/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...editForm
        });
      }
      
      setIsEditing(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-2xl shadow-2xl">
        {/* Dotted grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-4 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-lg animate-pulse delay-2000"></div>
        </div>

        <div className="relative px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="w-8 h-8 text-purple-200" />
                <h1 className="text-2xl font-bold mb-2">My Profile</h1>
              </div>
              <p className="text-purple-100">Manage your personal information and academic settings</p>
            </div>
            {profile && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-purple-100">Student ID</div>
                  <div className="font-semibold">{profile.studentId}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showNotification && (
        <div className="mx-8">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Profile updated successfully!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {profile && (
        <div className="px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 space-y-6 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-100 mx-auto bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center group cursor-pointer hover:ring-purple-200 transition-all duration-300">
                    <UserIcon className="w-16 h-16 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <CameraIcon className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-4">{profile.name}</h2>
                  <p className="text-gray-600">{profile.major}</p>
                  <p className="text-sm text-gray-500">{profile.year} Year</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <span className="text-sm font-medium text-gray-600">GPA</span>
                    <span className="font-bold text-purple-600">{profile.gpa?.toFixed(2) || '3.75'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {profile.status || 'Active'}
                    </span>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Progress</span>
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round(((profile.completedCredits || 96) / (profile.totalCredits || 120)) * 100)}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((profile.completedCredits || 96) / (profile.totalCredits || 120)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{profile.completedCredits || 96} completed</span>
                      <span className="text-xs text-gray-500">{profile.totalCredits || 120} total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 divide-y divide-gray-100 hover:shadow-xl transition-all duration-300">
                {/* Personal Information */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-purple-600" />
                      Personal Information
                    </h3>
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
                    >
                      {isEditing ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <PencilIcon className="w-4 h-4" />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => updateProfile('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profile.name}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => updateProfile('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          {profile.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => updateProfile('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          {profile.phone || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={(e) => updateProfile('address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter address"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          {profile.address || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                    Academic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-mono">{profile.studentId}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.major}
                          onChange={(e) => updateProfile('major', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profile.major}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                      {isEditing ? (
                        <select
                          value={editForm.year}
                          onChange={(e) => updateProfile('year', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="1st">1st Year</option>
                          <option value="2nd">2nd Year</option>
                          <option value="3rd">3rd Year</option>
                          <option value="4th">4th Year</option>
                        </select>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profile.year} Year</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Date</label>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        {profile.enrollmentDate ? new Date(profile.enrollmentDate).toLocaleDateString() : 'September 2022'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                          <p className="text-2xl font-bold text-blue-600">{profile.statistics?.totalSubmissions || 24}</p>
                        </div>
                        <BookOpenIcon className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Completed</p>
                          <p className="text-2xl font-bold text-green-600">{profile.statistics?.gradedAssignments || 18}</p>
                        </div>
                        <CheckIcon className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Average Grade</p>
                          <p className="text-2xl font-bold text-orange-600">{profile.statistics?.averageGrade || 87.5}%</p>
                        </div>
                        <TrophyIcon className="w-8 h-8 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-purple-600" />
                    Achievements & Awards
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 flex items-center gap-3 border border-purple-100 hover:shadow-md transition-all duration-300">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                        <TrophyIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Dean's List</div>
                        <div className="text-sm text-gray-600">Fall 2024</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 flex items-center gap-3 border border-blue-100 hover:shadow-md transition-all duration-300">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <BookOpenIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Perfect Attendance</div>
                        <div className="text-sm text-gray-600">Spring 2024</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 flex items-center gap-3 border border-green-100 hover:shadow-md transition-all duration-300">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                        <AcademicCapIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Top Performer</div>
                        <div className="text-sm text-gray-600">CS301 - Advanced Algorithms</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 flex items-center gap-3 border border-orange-100 hover:shadow-md transition-all duration-300">
                      <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                        <TrophyIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Academic Excellence</div>
                        <div className="text-sm text-gray-600">GPA &gt; 3.5 for 3 semesters</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
