'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import { 
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XMarkIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface TA {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  courses?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  name: string;
}

export default function TAManagement() {
  const { user, token } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string>('cs101'); // Default course
  const [searchTerm, setSearchTerm] = useState('');
  const [tas, setTAs] = useState<TA[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTAs = async () => {
    if (!token) {
      setError('Authentication token not found. Please login again.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${BASE_URL}/faculty/tas`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('TAs API endpoint not found. Please check the server configuration.');
        }
        throw new Error(`Failed to fetch TAs: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('TAs data:', data);
      
      if (!data.success || !data.data) {
        throw new Error('Invalid TAs data received');
      }
      
      setTAs(data.data);
    } catch (err) {
      console.error('Error fetching TAs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load TAs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      const timer = setTimeout(() => {
        fetchTAs();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, token]);

  // Mock data for courses - in real app, this would come from an API
  const courses: Course[] = [
    { id: 'cs101', name: 'Introduction to Computer Science' },
    { id: 'cs201', name: 'Data Structures' },
    { id: 'cs301', name: 'Algorithms' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TAs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading TAs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchTAs}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredTAs = tas.filter(ta =>
    ta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ta.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ta.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">TA Management</h1>
                <p className="text-purple-100 mt-1">Manage your teaching assistants and track their progress</p>
              </div>
            </div>
            {selectedCourse && (
              <button
                onClick={() => toast('Add TA functionality coming soon!')}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="font-medium">Add TA</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Course Selection */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Choose a course to manage TAs</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedCourse && (
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 mt-3" />
              <label className="block text-sm font-medium text-gray-700 mb-2">Search TAs</label>
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {selectedCourse && (
        <>
          {/* TAs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTAs.map((ta) => {
              // Get the assignment count for this TA
              const taAssignmentCount = assignments.filter((assignment: any) => 
                assignment.assignedTo === ta._id
              ).length;

              // Get the graded assignment count for this TA
              const gradedCount = submissions.filter((sub: any) => 
                sub.gradedBy === ta._id && sub.grade !== undefined && sub.grade !== null
              ).length;

              return (
                <div key={ta._id} className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <div className="p-6 relative z-10">
                    {/* TA Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {ta.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
                            {ta.name}
                          </h3>
                          <p className="text-sm text-gray-500">ID: {ta.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${ta.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {ta.isActive ? 'Active' : 'Inactive'}
                        </div>
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span>{ta.email}</span>
                      </div>
                      {ta.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <PhoneIcon className="h-4 w-4" />
                          <span>{ta.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{taAssignmentCount}</div>
                        <div className="text-xs text-blue-600">Assigned</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{gradedCount}</div>
                        <div className="text-xs text-green-600">Graded</div>
                      </div>
                    </div>

                    {/* Courses */}
                    {ta.courses && ta.courses.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Courses:</p>
                        <div className="flex flex-wrap gap-1">
                          {ta.courses.map((course, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* TA Info */}
                  <div className="text-sm text-gray-500">
                    <p>Joined: {ta.createdAt && ta.createdAt !== 'Invalid Date' ? new Date(ta.createdAt).toLocaleDateString() : 'Recently'}</p>
                    {ta.updatedAt && ta.updatedAt !== ta.createdAt && ta.updatedAt !== 'Invalid Date' && (
                      <p>Updated: {new Date(ta.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
          </div>

          {/* Empty State */}
          {filteredTAs.length === 0 && searchTerm && (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
                <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No TAs found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search terms.</p>
              </div>
            </div>
          )}

          {filteredTAs.length === 0 && !searchTerm && tas.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
                <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No TAs assigned</h3>
                <p className="text-gray-500 mb-6">Get started by adding TAs to this course.</p>
                <button
                  onClick={() => toast('TAs will appear here when they are assigned to courses.')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {!selectedCourse && (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
            <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Course</h3>
            <p className="text-gray-500">Choose a course from the dropdown above to view and manage TAs.</p>
          </div>
        </div>
      )}
    </div>
  );
}