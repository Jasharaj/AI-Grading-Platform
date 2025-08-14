'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { CourseFormModern } from '@/app/components/faculty/CourseFormModern';
import { BASE_URL } from '../../config';
import {
  BookOpenIcon,
  PlusIcon,
  AcademicCapIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon
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
  students?: string[]; // Array of student IDs
  isActive: boolean;
}

export default function ModernCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const response = await fetch(`${BASE_URL}/faculty/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        throw new Error('Courses endpoint not found. Please check backend configuration.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      console.log('Courses data received:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setCourses(data.data);
      } else if (Array.isArray(data)) {
        setCourses(data);
      } else {
        throw new Error('Invalid response format: expected array of courses');
      }
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'An unexpected error occurred while fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchCourses();
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleSubmitCourse = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const url = editingCourse 
        ? `${BASE_URL}/faculty/courses/${editingCourse._id}`
        : `${BASE_URL}/faculty/courses`;
      
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingCourse ? 'update' : 'create'} course`);
      }

      const result = await response.json();
      
      if (editingCourse) {
        setCourses(courses.map(course => 
          course._id === editingCourse._id ? result.data : course
        ));
      } else {
        setCourses([...courses, result.data]);
      }

      setShowForm(false);
      setEditingCourse(null);
    } catch (err: any) {
      console.error('Error submitting course:', err);
      alert(`Failed to ${editingCourse ? 'update' : 'create'} course: ` + err.message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleViewCourse = (course: Course) => {
    // Navigate to course details page
    window.location.href = `/faculty/courses/${course._id}`;
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_URL}/faculty/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Remove course from state
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (err: any) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course: ' + err.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <BookOpenIcon className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading courses...</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Courses</h3>
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
    <>
      {/* Modern Course Form */}
      <CourseFormModern
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitCourse}
        initialData={editingCourse}
      />

      <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-600 text-white mb-8 rounded-2xl shadow-2xl">
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
                <BookOpenIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Course Management</h1>
                <p className="text-blue-100 mt-1">Create, manage and track your courses</p>
              </div>
            </div>
            
            <Button 
              onClick={handleCreateCourse}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Course</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Courses List or Empty State */}
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BookOpenIcon className="h-16 w-16 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Courses Yet</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Create your first course to start managing assignments, students, and teaching materials.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" onClick={handleCreateCourse}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div 
                key={course._id} 
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Status Indicator Bar */}
                <div className={`h-1.5 ${course.isActive ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`}></div>
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 mb-2">
                        {course.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm mb-2">
                        {course.code}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {course.description || 'No description provided'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.isActive 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Academic Year</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {course.year} - {course.semester}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <UsersIcon className="h-4 w-4" />
                        <span>Students</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {course.students?.length || 0}
                      </span>
                    </div>

                    {course.faculty && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <AcademicCapIcon className="h-4 w-4" />
                          <span>Faculty</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {course.faculty.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewCourse(course)}
                      className="flex-1 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button 
                      onClick={() => handleEditCourse(course)}
                      className="flex-1 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl hover:bg-purple-100 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course._id)}
                      className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
