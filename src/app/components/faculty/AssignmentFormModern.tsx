'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import {
  XMarkIcon,
  DocumentTextIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface TA {
  _id: string;
  id: string;
  name: string;
  email: string;
}

interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  semester: string;
  year: number;
}

interface AssignmentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export const AssignmentFormModern = ({ onSubmit, onCancel, initialData }: AssignmentFormProps) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
    maxMarks: initialData?.maxMarks || '',
    instructions: initialData?.instructions || '',
    course: initialData?.course || '',
    selectedTAs: initialData?.selectedTAs || [],
  });
  
  const [availableTAs, setAvailableTAs] = useState<TA[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loadingTAs, setLoadingTAs] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch TAs from backend
  const fetchTAs = async () => {
    try {
      setLoadingTAs(true);
      const response = await fetch(`${BASE_URL}/faculty/tas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TAs');
      }

      const data = await response.json();
      if (data.success) {
        setAvailableTAs(data.data);
      }
    } catch (err) {
      console.error('Error fetching TAs:', err);
      toast.error('Failed to load TAs');
    } finally {
      setLoadingTAs(false);
    }
  };

  // Fetch Courses from backend
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await fetch(`${BASE_URL}/faculty/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      if (data.success) {
        setAvailableCourses(data.data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      toast.error('Failed to load courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTAs();
      fetchCourses();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter an assignment title');
      return;
    }
    
    if (!formData.course) {
      toast.error('Please select a course');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (!formData.dueDate) {
      toast.error('Please select a due date');
      return;
    }
    
    if (!formData.maxMarks || parseInt(formData.maxMarks) <= 0) {
      toast.error('Please enter valid maximum marks');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTA = (taId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTAs: prev.selectedTAs.includes(taId)
        ? prev.selectedTAs.filter((id: string) => id !== taId)
        : [...prev.selectedTAs, taId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
                               radial-gradient(circle at 75% 25%, white 2px, transparent 2px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {initialData ? 'Edit Assignment' : 'Create New Assignment'}
                </h2>
                <p className="text-purple-100 mt-1">Design an engaging learning experience</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/30 hover:border-white/50"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                    <span>Assignment Title</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="Enter a compelling title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
                    <span>Course</span>
                  </label>
                  {loadingCourses ? (
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"></div>
                      Loading courses...
                    </div>
                  ) : (
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    >
                      <option value="">Select a course...</option>
                      {availableCourses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.code} - {course.name} ({course.semester} {course.year})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                    <span>Due Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
                    <span>Maximum Marks</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="1000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="100"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                    <span>Description</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white resize-none"
                    placeholder="Describe what students need to accomplish..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <ClockIcon className="h-5 w-5 text-indigo-600" />
                    <span>Instructions</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white resize-none"
                    placeholder="Provide detailed instructions for students..."
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* TA Assignment */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-4">
                <UserGroupIcon className="h-5 w-5 text-indigo-600" />
                <span>Assign Teaching Assistants</span>
                {formData.selectedTAs.length > 0 && (
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                    {formData.selectedTAs.length} selected
                  </span>
                )}
              </label>
              
              {loadingTAs ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : availableTAs.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No TAs available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableTAs.map((ta) => (
                    <div
                      key={ta._id}
                      onClick={() => toggleTA(ta._id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        formData.selectedTAs.includes(ta._id)
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                          formData.selectedTAs.includes(ta._id)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {ta.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            formData.selectedTAs.includes(ta._id) ? 'text-indigo-900' : 'text-gray-900'
                          }`}>
                            {ta.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{ta.email}</p>
                        </div>
                        {formData.selectedTAs.includes(ta._id) && (
                          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    <span>{initialData ? 'Update Assignment' : 'Create Assignment'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
