'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/app/components/common/Select';
import { Input } from '@/app/components/common/Input';
import { useAuth } from '@/app/context/AuthContext';
import { BASE_URL } from '@/app/config';
import {
  ClipboardDocumentCheckIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  PencilIcon,
  StarIcon
} from '@heroicons/react/24/outline';

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

// Grade Submission Button Component
function GradeSubmissionButton({ 
  submission, 
  onGrade, 
  isLoading 
}: { 
  submission: Submission;
  onGrade: (submissionId: string, grade: number, feedback: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const [grade, setGrade] = useState(submission.grade?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericGrade = parseFloat(grade);
    
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > submission.assignment.maxMarks) {
      alert(`Grade must be between 0 and ${submission.assignment.maxMarks}`);
      return;
    }

    await onGrade(submission._id, numericGrade, feedback);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isLoading}
        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        ) : (
          <>
            <PencilIcon className="h-4 w-4" />
            <span>{submission.grade !== null && submission.grade !== undefined ? 'Update Grade' : 'Grade'}</span>
          </>
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Grade Submission - {submission.student.name}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade (Max: {submission.assignment.maxMarks})
                </label>
                <input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  max={submission.assignment.maxMarks}
                  min="0"
                  step="0.1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Provide feedback for the student..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Submit Grade
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function EvaluateContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gradingSubmission, setGradingSubmission] = useState<string | null>(null);

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

  const handleGradeSubmission = async (submissionId: string, grade: number, feedback: string) => {
    try {
      setGradingSubmission(submissionId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${BASE_URL}/ta/grade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          submissionId,
          grade,
          feedback
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit grade');
      }

      const data = await response.json();
      if (data.success) {
        // Update local state
        setSubmissions(prev => prev.map(sub => 
          sub._id === submissionId 
            ? { ...sub, grade, feedback }
            : sub
        ));
      }
    } catch (err) {
      console.error('Error grading submission:', err);
      alert('Failed to submit grade. Please try again.');
    } finally {
      setGradingSubmission(null);
    }
  };
  
  const submissions_old = [];

  // Mock students data - in real app this would come from API
  const students = [
    { id: 'STU001', name: 'John Doe', courseId: 'CS101' },
    { id: 'STU002', name: 'Jane Smith', courseId: 'CS202' },
    { id: 'STU003', name: 'Mike Johnson', courseId: 'CS101' },
    { id: 'STU004', name: 'Sarah Wilson', courseId: 'CS303' },
    { id: 'STU005', name: 'David Brown', courseId: 'CS202' },
  ];

  const courseOptions = [
    { value: '', label: 'All Courses' },
    ...courses.map(course => ({
      value: course.code,
      label: `${course.name} (${course.code})`
    }))
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending Evaluation' },
    { value: 'completed', label: 'Evaluation Complete' },
    { value: 'review', label: 'Under Review' },
  ];

  // Filter submissions based on selected filters
  const filteredSubmissions = submissions.filter((submission: Submission) => {
    const matchesCourse = !selectedCourse || submission.assignment.title.includes(selectedCourse);
    const matchesStatus = !selectedStatus || 
      (selectedStatus === 'pending' && (submission.grade === null || submission.grade === undefined)) ||
      (selectedStatus === 'completed' && (submission.grade !== null && submission.grade !== undefined));
    const matchesSearch = !searchQuery || 
      submission.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.student.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const pendingEvaluations = submissions.filter(s => s.grade === null || s.grade === undefined).length;
  const completedEvaluations = submissions.filter(s => s.grade !== null && s.grade !== undefined).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white mb-8 rounded-2xl shadow-2xl">
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
                <ClipboardDocumentCheckIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Evaluate Submissions</h1>
                <p className="text-xl text-green-100 mt-2">Grade assignments and provide comprehensive feedback to students</p>
              </div>
            </div>
            
            <button className="hidden sm:inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FunnelIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filter Students</h3>
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
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={statusOptions}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
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

        {/* Submissions Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredSubmissions.map((submission) => (
                <div key={submission._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{submission.student.name}</h3>
                        <p className="text-sm text-gray-600">{submission.student.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Assignment:</span>
                        <span className="text-sm text-gray-600">{submission.assignment.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Max Marks:</span>
                        <span className="text-sm text-gray-600">{submission.assignment.maxMarks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        {submission.grade !== null && submission.grade !== undefined ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Graded ({submission.grade}/{submission.assignment.maxMarks})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {submission.feedback && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                        <h4 className="text-sm font-medium text-green-900 mb-1">Feedback:</h4>
                        <p className="text-sm text-green-800">{submission.feedback}</p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex space-x-2">
                        <GradeSubmissionButton 
                          submission={submission}
                          onGrade={handleGradeSubmission}
                          isLoading={gradingSubmission === submission._id}
                        />
                        {submission.fileUrl && (
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            View File
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600 mb-6">
                  {submissions.length === 0 
                    ? "No submissions are assigned to you yet." 
                    : "Try adjusting your filters to see more submissions."
                  }
                </p>
                {filteredSubmissions.length === 0 && submissions.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedCourse('');
                      setSelectedStatus('');
                      setSearchQuery('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Evaluate() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <EvaluateContent />
    </Suspense>
  );
}
