'use client';

import { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import toast from 'react-hot-toast';

// Local Status type definition
type Status = 'pending' | 'approved' | 'rejected' | 'in-review' | 'revaluation_requested';

// Local StatusChip component
function StatusChip({ status }: { status: Status }) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    'in-review': { color: 'bg-blue-100 text-blue-800', label: 'In Review' },
    approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
    'revaluation_requested': { color: 'bg-purple-100 text-purple-800', label: 'Under Review' },
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

interface RevaluationRequest {
  _id: string;
  assignment: {
    _id: string;
    title: string;
    course?: {
      name: string;
      code: string;
    };
  };
  grade: number;
  revaluationReason: string;
  status: Status;
  revaluationRequestedAt: string;
}

interface GradedAssignment {
  _id: string;
  assignment: {
    _id: string;
    title: string;
    course?: {
      name: string;
      code: string;
    };
  };
  grade: number;
  revaluationRequested: boolean;
}

const steps = ['Submit Request', 'Faculty Review', 'Decision'];

export default function RevaluationPage() {
  const { token } = useAuth();
  const [revaluationRequests, setRevaluationRequests] = useState<RevaluationRequest[]>([]);
  const [gradedAssignments, setGradedAssignments] = useState<GradedAssignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [reason, setReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = BASE_URL;

  useEffect(() => {
    if (token) {
      fetchRevaluationRequests();
      fetchGradedAssignments();
    }
  }, [token]);

  const fetchRevaluationRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/revaluation`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch revaluation requests: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setRevaluationRequests(data.data);
      } else {
        throw new Error(data.message || 'Failed to load revaluation requests');
      }
    } catch (error) {
      console.error('Error fetching revaluation requests:', error);
      toast.error('Failed to load revaluation requests');
    }
  };

  const fetchGradedAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/students/grades`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch graded assignments: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data && data.data.grades) {
        // Filter out assignments that already have revaluation requests
        const availableForRevaluation = data.data.grades.filter(
          (grade: GradedAssignment) => !grade.revaluationRequested
        );
        setGradedAssignments(availableForRevaluation);
      } else {
        throw new Error(data.message || 'Failed to load graded assignments');
      }
    } catch (error) {
      console.error('Error fetching graded assignments:', error);
      toast.error('Failed to load graded assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment || !reason.trim()) {
      toast.error('Please select an assignment and provide a reason');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/students/revaluation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gradingId: selectedAssignment,
          reason: reason.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
      }

      if (data.success) {
        toast.success('Revaluation request submitted successfully!');
        setSelectedAssignment('');
        setReason('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Refresh the data
        fetchRevaluationRequests();
        fetchGradedAssignments();
      } else {
        throw new Error(data.message || 'Failed to submit revaluation request');
      }
    } catch (error) {
      console.error('Error submitting revaluation request:', error);
      toast.error(`Failed to submit request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading revaluation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white rounded-2xl shadow-2xl">
        {/* Dotted grid pattern */}
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
        
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Re-Evaluation Requests</h1>
                <p className="text-orange-100">Submit and track your grade re-evaluation requests</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/student/grades"
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 border border-white/30 hover:border-white/50"
              >
                <AcademicCapIcon className="w-4 h-4" />
                <span>View Grades</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-800 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
              <span className="font-medium">Your re-evaluation request has been submitted successfully!</span>
            </div>
          </div>
        )}

        {/* Enhanced New Request Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Submit New Re-Evaluation Request</h2>
            </div>
            <p className="text-gray-600">Request a review of your assignment grade with detailed reasoning</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="assignment" className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Assignment
                  </label>
                  <select
                    id="assignment"
                    value={selectedAssignment}
                    onChange={(e) => setSelectedAssignment(e.target.value)}
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black bg-white px-4 py-3 transition-all duration-300"
                    disabled={submitting}
                  >
                    <option value="" className="text-black">Select an assignment</option>
                    {gradedAssignments.map((grading) => (
                      <option key={grading._id} value={grading._id} className="text-black">
                        {grading.assignment.title} - Grade: {grading.grade}%
                      </option>
                    ))}
                  </select>
                  {gradedAssignments.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">No graded assignments available for revaluation</p>
                  )}
                </div>
                
                {selectedAssignment && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Assignment Details</h4>
                    {gradedAssignments.find(g => g._id === selectedAssignment) && (
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Course:</span> {gradedAssignments.find(g => g._id === selectedAssignment)?.assignment?.course?.name || 'N/A'}</p>
                        <p><span className="font-medium">Current Grade:</span> {gradedAssignments.find(g => g._id === selectedAssignment)?.grade}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                  Detailed Reason for Re-evaluation
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black bg-white px-4 py-3 transition-all duration-300"
                  placeholder="Please provide detailed explanation for your re-evaluation request..."
                />
                <p className="text-xs text-gray-500 mt-2">Include specific questions, marks allocation concerns, or any other relevant details</p>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={submitting || !selectedAssignment || !reason.trim()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Enhanced Existing Requests */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Your Re-Evaluation Requests</h3>
            </div>
            <p className="text-gray-600">Track the status of your submitted requests</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Re-evaluation Process</span>
              </h4>
              <div className="relative flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${index <= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}
                    `}>
                      {index + 1}
                    </div>
                    <div className="mt-2 text-sm text-center text-gray-600">
                      {step}
                    </div>
                  </div>
                ))}
                <div className="absolute top-4 left-0 right-0 flex justify-between z-0">
                  <div className="h-0.5 bg-orange-600" style={{ width: '33%', marginLeft: '4%' }} />
                  <div className="h-0.5 bg-gray-200" style={{ width: '33%', marginRight: '4%' }} />
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {revaluationRequests.map((request, index) => (
                <div 
                  key={request._id} 
                  className="group p-6 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                        ${request.status === 'approved' ? 'bg-green-100 text-green-600' : 
                          request.status === 'revaluation_requested' ? 'bg-purple-100 text-purple-600' : 
                          'bg-yellow-100 text-yellow-600'}`}>
                        {request.status === 'approved' ? <CheckCircleIcon className="w-6 h-6" /> :
                         request.status === 'revaluation_requested' ? <ClockIcon className="w-6 h-6" /> :
                         <DocumentTextIcon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{request.assignment.title}</h4>
                          <span className="text-sm font-medium text-gray-500">
                            {request.assignment.course?.name || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span><span className="font-medium">Grade:</span> {request.grade}%</span>
                          <span><span className="font-medium">Submitted:</span> {new Date(request.revaluationRequestedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">Reason:</span> {request.revaluationReason}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <StatusChip status={request.status} />
                    </div>
                  </div>
                </div>
              ))}
              
              {revaluationRequests.length === 0 && (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                  <p className="text-gray-500">Submit your first re-evaluation request above</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
