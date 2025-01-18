'use client';

import { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import StatusChip, { Status } from '../../components/StatusChip';

interface RevaluationRequest {
  id: string;
  assignment: string;
  course: string;
  originalGrade: number;
  reason: string;
  status: Status;
  submittedDate: string;
}

const initialRequests: RevaluationRequest[] = [
  {
    id: '1',
    assignment: 'Calculus Midterm',
    course: 'Advanced Mathematics',
    originalGrade: 85,
    reason: 'Question 3 solution matches the textbook example',
    status: 'in-review',
    submittedDate: '2025-01-15',
  },
  {
    id: '2',
    assignment: 'Programming Assignment 1',
    course: 'Computer Science 101',
    originalGrade: 78,
    reason: 'Test cases passed but partial credit given',
    status: 'approved',
    submittedDate: '2025-01-10',
  },
];

const assignments = [
  { id: '1', name: 'Calculus Midterm', course: 'Advanced Mathematics', grade: 85 },
  { id: '2', name: 'Programming Assignment 1', course: 'Computer Science 101', grade: 78 },
];

const steps = ['Submit Request', 'Faculty Review', 'Decision'];

export default function RevaluationPage() {
  const [revaluationRequests, setRevaluationRequests] = useState<RevaluationRequest[]>(initialRequests);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [reason, setReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment || !reason.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const assignment = assignments.find(a => a.id === selectedAssignment);
    if (!assignment) return;

    const newRequest: RevaluationRequest = {
      id: (revaluationRequests.length + 1).toString(),
      assignment: assignment.name,
      course: assignment.course,
      originalGrade: assignment.grade,
      reason: reason.trim(),
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
    };

    setRevaluationRequests([newRequest, ...revaluationRequests]);
    setSelectedAssignment('');
    setReason('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <PageContainer
      title="Re-Evaluation Requests"
      subtitle="Submit and track your re-evaluation requests"
    >
      <div className="grid gap-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">Your re-evaluation request has been submitted successfully!</span>
          </div>
        )}

        {/* New Request Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Submit New Re-Evaluation Request
            </h2>
            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Assignment
                  </label>
                  <select
                    id="assignment"
                    value={selectedAssignment}
                    onChange={(e) => setSelectedAssignment(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-black"
                  >
                    <option value="" className="text-black">Select an assignment</option>
                    {assignments.map((assignment) => (
                      <option key={assignment.id} value={assignment.id} className="text-black">
                        {assignment.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Re-evaluation
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-black"
                  placeholder="Please provide detailed explanation for your re-evaluation request..."
                />
              </div>
              <div>
                <button 
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Process Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Re-evaluation Process
          </h2>
          <div className="relative flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                <div className="mt-2 text-sm text-center text-gray-600">
                  {step}
                </div>
              </div>
            ))}
            {/* Connecting lines */}
            <div className="absolute top-4 left-0 right-0 flex justify-between z-0">
              <div className={`h-0.5 w-full bg-purple-600 flex-1`} style={{ width: '33%', marginLeft: '4%' }} />
              <div className={`h-0.5 w-full bg-gray-200 flex-1`} style={{ width: '33%', marginRight: '4%' }} />
            </div>
          </div>
        </div>

        {/* Existing Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Your Requests
            </h2>
            <div className="divide-y divide-gray-200">
              {revaluationRequests.map((request) => (
                <div key={request.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        {request.assignment}
                      </h3>
                      <div className="mt-1 text-sm text-gray-500">
                        Course: {request.course}
                        <br />
                        Original Grade: {request.originalGrade}%
                        <br />
                        Submitted: {request.submittedDate}
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <strong>Reason:</strong> {request.reason}
                      </div>
                    </div>
                    <StatusChip status={request.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
