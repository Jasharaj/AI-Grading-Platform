'use client';

import React, { useState, useEffect } from 'react';
import { Select } from '@/app/components/common/Select';
import { Input } from '@/app/components/common/Input';
import { useAuth } from '@/app/context/AuthContext';
import { BASE_URL } from '@/app/config';
import {
  DocumentTextIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Submission {
  _id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  assignment: {
    _id: string;
    title: string;
    maxMarks: number;
    dueDate: string;
  };
  submittedAt: string;
  grade?: number;
  feedback?: string;
  fileUrl?: string;
}

interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  semester: string;
  year: number;
}

export default function Submissions() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${BASE_URL}/ta/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCourses(data.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      // Don't show error for courses as it's not critical
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/ta/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      } else {
        setError(data.message || 'Failed to fetch submissions');
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };
  
  const submissions_old = [];

  // Generate course options dynamically from fetched courses
  const courseOptions = [
    { value: '', label: 'All Courses' },
    ...courses.map(course => ({
      value: course.code,
      label: `${course.code} - ${course.name}`
    }))
  ];

  const gradeOptions = [
    { value: '', label: 'All Grades' },
    { value: 'Ex', label: 'Ex (Excellent)' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'P', label: 'P (Pass)' },
    { value: 'F', label: 'F (Fail)' },
  ];

  // Filter submissions based on selected filters
  const filteredSubmissions = submissions.filter((submission: Submission) => {
    const matchesCourse = !selectedCourse || submission.assignment.title.toLowerCase().includes(selectedCourse.toLowerCase());
    const matchesGrade = !selectedGrade || (submission.grade && getGradeLetter(submission.grade, submission.assignment.maxMarks) === selectedGrade);
    const matchesSearch = !searchQuery || 
      submission.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesGrade && matchesSearch;
  });

  // Helper function to convert numeric grade to letter grade
  function getGradeLetter(grade: number, maxMarks: number): string {
    const percentage = (grade / maxMarks) * 100;
    if (percentage >= 90) return 'Ex';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    if (percentage >= 40) return 'P';
    return 'F';
  }

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter((s: Submission) => s.grade !== null && s.grade !== undefined).length;
  const pendingSubmissions = totalSubmissions - gradedSubmissions;
  const averageGrade = calculateAverageGrade(submissions);

  function calculateAverageGrade(submissions: Submission[]) {
    const grades = submissions
      .filter(s => s.grade !== null && s.grade !== undefined)
      .map(s => s.grade!);

    if (grades.length === 0) return 'N/A';

    const average = grades.reduce((a, b) => a + b, 0) / grades.length;
    return average.toFixed(1);
  }

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case 'Ex': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-600 text-white mb-8 rounded-2xl shadow-2xl">
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
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Student Submissions</h1>
                <p className="text-xl text-emerald-100 mt-2">Review and manage all student submissions efficiently</p>
              </div>
            </div>
            
            <Link 
              href="/TA/evaluate"
              className="hidden sm:inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Evaluate
            </Link>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FunnelIcon className="h-5 w-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filter Submissions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Course</label>
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                options={courseOptions}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Grade</label>
              <Select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                options={gradeOptions}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading submissions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
              <div className="text-red-600 mb-2">⚠️ Error Loading Submissions</div>
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={() => {
                  setError('');
                  setLoading(true);
                  fetchSubmissions();
                }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Submissions List */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <div key={submission._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{submission.student.name}</h3>
                            {submission.grade && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getGradeColor(getGradeLetter(submission.grade, submission.assignment.maxMarks))}`}>
                                Grade: {submission.grade}/{submission.assignment.maxMarks}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>ID: {submission.student.id}</span>
                            <span>Assignment: {submission.assignment.title}</span>
                            <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link 
                          href={`/TA/evaluate?submissionId=${submission._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Grade submission"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        {submission.fileUrl && (
                          <a 
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            title="View file"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Submission Content */}
                    <div className="space-y-4">
                      {submission.feedback && (
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                          <h4 className="font-medium text-green-900 mb-2">Feedback</h4>
                          <p className="text-green-800 text-sm">{submission.feedback}</p>
                        </div>
                      )}
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        {submission.grade !== null && submission.grade !== undefined ? (
                          <span className="flex items-center space-x-1 text-green-600">
                            <CheckCircleIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">Graded</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-orange-600">
                            <ClockIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">Pending</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Max: {submission.assignment.maxMarks} marks
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-500">No submissions match your current filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/TA/evaluate"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Evaluate Students
            </Link>
            <Link 
              href="/TA"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              View Dashboard
            </Link>
            <Link 
              href="/TA/plagiarism-check"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Plagiarism Check
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
