'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { BASE_URL } from '../../../config';
import {
  BookOpenIcon,
  ArrowLeftIcon,
  UsersIcon,
  CalendarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  semester: string;
  year: number;
  faculty?: {
    _id: string;
    name: string;
    email: string;
  };
  students?: any[];
  isActive: boolean;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Try direct course fetch first
      let response = await fetch(`${BASE_URL}/faculty/courses/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // If direct fetch fails, try getting all courses and find the one we need
      if (!response.ok) {
        response = await fetch(`${BASE_URL}/faculty/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }

        const data = await response.json();
        const courses = data.success ? data.data : data;
        const foundCourse = courses.find((course: any) => course._id === params.id);
        
        if (!foundCourse) {
          throw new Error('Course not found');
        }
        
        setCourse(foundCourse);
        return;
      }

      const data = await response.json();
      setCourse(data.data || data);
    } catch (err: any) {
      console.error('Error fetching course:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchCourseDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The course you requested could not be found.'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-600 text-white mb-8 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 25%, white 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              onClick={() => router.back()}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
              <BookOpenIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{course.name}</h1>
              <p className="text-blue-100 mt-1">{course.code}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Information */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900 mt-1">{course.description || 'No description provided'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Semester</label>
                    <p className="text-gray-900 mt-1">{course.semester}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Year</label>
                    <p className="text-gray-900 mt-1">{course.year}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      course.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Students Section */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Enrolled Students</h2>
              {course.students && course.students.length > 0 ? (
                <div className="space-y-3">
                  {course.students.map((student: any, index: number) => (
                    <div key={student._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {student.name ? student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : `S${index + 1}`}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name || `Student ${index + 1}`}</div>
                          <div className="text-sm text-gray-500">{student.email || 'No email'}</div>
                        </div>
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        {student.id || student.studentId || `STU${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No students enrolled in this course yet.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">Students</span>
                  </div>
                  <span className="font-bold text-gray-900">{course.students?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-600">Assignments</span>
                  </div>
                  <span className="font-bold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="h-5 w-5 text-green-600" />
                    <span className="text-gray-600">Average Grade</span>
                  </div>
                  <span className="font-bold text-gray-900">-</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
                <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Manage Students
                </Button>
                <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
