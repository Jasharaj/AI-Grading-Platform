'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { BASE_URL } from '@/app/config';
import { toast } from 'react-hot-toast';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  StarIcon,
  FireIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface Submission {
  _id: string;
  student: {
    _id: string;
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
  submissionText?: string;
  submissionFile?: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  ta?: {
    _id: string;
    id: string;
    name: string;
  };
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
}

export default function GradingPage() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = BASE_URL;

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/faculty/assignments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch assignments: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setAssignments(data.data);
          setError(null);
          
          // Auto-select the first assignment if available
          if (data.data.length > 0) {
            setSelectedAssignmentId(data.data[0]._id);
          }
        } else {
          throw new Error(data.message || 'Failed to load assignments');
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch assignments');
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token, API_BASE_URL]);

  // Fetch submissions for selected assignment
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedAssignmentId || !token) {
        setSubmissions([]);
        return;
      }

      setSubmissionsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/faculty/assignments/${selectedAssignmentId}/submissions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch submissions: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setSubmissions(data.data);
        } else {
          throw new Error(data.message || 'Failed to load submissions');
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to load submissions');
        setSubmissions([]);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    fetchSubmissions();
  }, [selectedAssignmentId, token, API_BASE_URL]);

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(submission =>
    submission.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get grading statistics
  const gradingStats = {
    totalSubmissions: submissions.length,
    gradedSubmissions: submissions.filter(sub => sub.grade !== undefined).length,
    pendingSubmissions: submissions.filter(sub => sub.grade === undefined).length,
    averageGrade: submissions.length > 0 
      ? (submissions.filter(sub => sub.grade !== undefined).reduce((acc, sub) => acc + (sub.grade || 0), 0) / 
         submissions.filter(sub => sub.grade !== undefined).length || 0).toFixed(1)
      : 0
  };

  const getStatusBadge = (submission: Submission) => {
    if (submission.grade !== undefined) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Graded
        </span>
      );
    }
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-2xl shadow-2xl">
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
                <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Grading & Feedback Center</h1>
                <p className="text-purple-100 mt-1">Review, grade and provide feedback on student submissions</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
              <div className="text-center">
                <div className="text-2xl font-bold">{gradingStats.totalSubmissions}</div>
                <div className="text-purple-100 text-sm">Total Submissions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Grading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Submissions</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{gradingStats.totalSubmissions}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Graded</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{gradingStats.gradedSubmissions}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">{gradingStats.pendingSubmissions}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Grade</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{gradingStats.averageGrade}%</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      {/* Assignment Selection and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
              <label className="text-sm font-medium text-gray-700">Select Assignment:</label>
            </div>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white min-w-[250px]"
            >
              <option value="">Select an assignment</option>
              {assignments.map((assignment) => (
                <option key={assignment._id} value={assignment._id}>
                  {assignment.title}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex-1 lg:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Student Submissions</h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedAssignmentId 
                  ? `Showing ${filteredSubmissions.length} of ${submissions.length} submissions`
                  : 'Select an assignment to view submissions'
                }
              </p>
            </div>
            {selectedAssignmentId && (
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round((gradingStats.gradedSubmissions / gradingStats.totalSubmissions) * 100) || 0}% Complete
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                      style={{ width: `${(gradingStats.gradedSubmissions / gradingStats.totalSubmissions) * 100 || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {submissionsLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        ) : !selectedAssignmentId ? (
          <div className="p-12 text-center">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 max-w-md mx-auto">
              <ClipboardDocumentListIcon className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Assignment Selected</h3>
              <p className="text-gray-600">Please select an assignment from the dropdown above to view submissions.</p>
            </div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl p-8 max-w-md mx-auto">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm ? 'No submissions found' : 'No submissions yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Submissions will appear here once students submit their work'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50">
            {filteredSubmissions.map((submission) => (
              <div key={submission._id} className="group p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Student Info */}
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {submission.student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {submission.student.name}
                        </h3>
                        <span className="text-sm text-gray-500">#{submission.student.id}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <UserIcon className="h-4 w-4" />
                          <span>TA: {submission.ta ? submission.ta.name : 'Not assigned'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Grade */}
                  <div className="flex items-center space-x-4">
                    {/* Status Badge */}
                    <div className="text-center">
                      {submission.grade !== undefined ? (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Graded
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Pending
                        </div>
                      )}
                    </div>

                    {/* Grade Display */}
                    <div className="text-right min-w-[80px]">
                      {submission.grade !== undefined ? (
                        <div>
                          <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {submission.grade}/{submission.assignment.maxMarks}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((submission.grade / submission.assignment.maxMarks) * 100)}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          <div className="text-xl font-bold">-</div>
                          <div className="text-xs">Not graded</div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="group/btn relative p-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all duration-200 hover:scale-105">
                        <EyeIcon className="h-5 w-5" />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                          View Submission
                        </div>
                      </button>
                      {submission.grade === undefined && (
                        <button className="group/btn relative p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200 hover:scale-105">
                          <PencilSquareIcon className="h-5 w-5" />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                            Grade Now
                          </div>
                        </button>
                      )}
                      {submission.grade !== undefined && (
                        <button className="group/btn relative p-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-200 hover:scale-105">
                          <StarIcon className="h-5 w-5" />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
                            View Feedback
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar for Individual Submission */}
                {submission.grade !== undefined && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Performance</span>
                      <span className="text-xs text-gray-500">
                        {Math.round((submission.grade / submission.assignment.maxMarks) * 100)}% Score
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          (submission.grade / submission.assignment.maxMarks) * 100 >= 80 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : (submission.grade / submission.assignment.maxMarks) * 100 >= 60 
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-red-500 to-pink-600'
                        }`}
                        style={{ width: `${(submission.grade / submission.assignment.maxMarks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <FireIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              Grading Best Practices
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                • Review submissions carefully and provide constructive, specific feedback
              </p>
              <p>
                • Ensure grading is consistent and fair across all students using rubrics
              </p>
              <p>
                • Assign TAs to help distribute grading workload and maintain efficiency
              </p>
              <p>
                • Use positive reinforcement alongside areas for improvement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
