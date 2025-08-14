'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { BASE_URL } from '../../config';
import {
  UserGroupIcon,
  PlusIcon,
  AcademicCapIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  StarIcon,
  SparklesIcon,
  EnvelopeIcon,
  PhoneIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface TA {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  phone?: string;
  courses?: string[];
  isActive: boolean;
}

export default function TAsPage() {
  const [tas, setTAs] = useState<TA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTAs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const response = await fetch(`${BASE_URL}/faculty/tas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        throw new Error('TAs endpoint not found. Please check backend configuration.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch TAs: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('TAs data received:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setTAs(data.data);
      } else if (Array.isArray(data)) {
        setTAs(data);
      } else {
        throw new Error('Invalid response format: expected array of TAs');
      }
    } catch (err: any) {
      console.error('Error fetching TAs:', err);
      setError(err.message || 'An unexpected error occurred while fetching TAs');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchTAs();
  };

  useEffect(() => {
    fetchTAs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <UserGroupIcon className="h-6 w-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading teaching assistants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center border border-red-200 bg-red-50">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load TAs</h3>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700 text-white">
            Try Again
          </Button>
        </Card>
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
            backgroundSize: '35px 35px'
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
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Teaching Assistants</h1>
                <p className="text-xl text-indigo-100 mt-2">Manage your teaching assistant team</p>
              </div>
            </div>
            
            <Button 
              className="hidden sm:inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add TA
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Total TAs</p>
                  <p className="text-2xl font-bold text-white">{tas.length}</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-white/60" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Active TAs</p>
                  <p className="text-2xl font-bold text-white">{tas.filter(t => t.isActive).length}</p>
                </div>
                <AcademicCapIcon className="h-8 w-8 text-white/60" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Course Coverage</p>
                  <p className="text-2xl font-bold text-white">{tas.reduce((sum, t) => sum + (t.courses?.length || 0), 0)}</p>
                </div>
                <BookOpenIcon className="h-8 w-8 text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* TAs List or Empty State */}
        {tas.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-indigo-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <UserGroupIcon className="h-16 w-16 text-indigo-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Teaching Assistants</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Start building your teaching team by adding your first teaching assistant.
            </p>
            <Button className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Your First TA
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tas.map((ta, index) => (
              <div 
                key={ta._id} 
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* TA Header */}
                <div className="relative p-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <UserGroupIcon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-200 transition-colors">
                          {ta.name}
                        </h3>
                        <p className="text-indigo-100 text-sm mb-1">
                          ID: {ta.studentId}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${ta.isActive ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`}></div>
                          <span className="text-indigo-100 text-xs">
                            {ta.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TA Content */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{ta.email}</span>
                    </div>
                    
                    {ta.phone && (
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{ta.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <BookOpenIcon className="h-4 w-4" />
                        <span className="text-sm">Courses Assigned</span>
                      </div>
                      <span className="font-semibold text-gray-900">{ta.courses?.length || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm">Status</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ta.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ta.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 group-hover:border-indigo-500 group-hover:text-indigo-600 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 group-hover:border-pink-500 group-hover:text-pink-600 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-pink-600/0 group-hover:from-indigo-600/5 group-hover:to-pink-600/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
