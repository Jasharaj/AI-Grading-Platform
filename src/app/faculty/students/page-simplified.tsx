'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '../../config';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import PageContainer from '@/app/components/PageContainer';

// Backend Student interface
interface Student {
  _id: string;
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function StudentsPage() {
  const { user, token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/student/getAllStudents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch students error:', response.status, errorText);
        
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          setLoading(false);
          return;
        } else if (response.status === 403) {
          setError('Access denied. You may not have Faculty permissions.');
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch students: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Students data received:', data);
      
      if (!data.success || !data.data) {
        throw new Error('Invalid students data received');
      }
      
      setStudents(data.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchStudents();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Students</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchStudents}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer title="Students" subtitle="Manage and view student information">
      <div className="space-y-6">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name, email, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'No students are currently enrolled.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredStudents.map((student) => (
              <div key={student._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                      <p className="text-xs text-gray-400">ID: {student.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">-</p>
                      <p className="text-xs text-gray-500">Assignments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">-</p>
                      <p className="text-xs text-gray-500">Submitted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">-</p>
                      <p className="text-xs text-gray-500">Graded</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">-</p>
                      <p className="text-xs text-gray-500">Avg Grade</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Joined: {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                  {student.updatedAt !== student.createdAt && (
                    <p className="text-xs text-gray-500">
                      Last updated: {new Date(student.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
