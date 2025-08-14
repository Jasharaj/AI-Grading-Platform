'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { BASE_URL } from '../../../config';
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  maxMarks: number;
  course: {
    _id: string;
    name: string;
    code: string;
  };
  createdAt: string;
}

export default function AssignmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignmentDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Try direct assignment fetch first
      let response = await fetch(`${BASE_URL}/faculty/assignments/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // If direct fetch fails, try getting all assignments and find the one we need
      if (!response.ok) {
        response = await fetch(`${BASE_URL}/faculty/assignments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assignment details');
        }

        const data = await response.json();
        const assignments = data.success ? data.data : data;
        const foundAssignment = assignments.find((assignment: any) => assignment._id === params.id);
        
        if (!foundAssignment) {
          throw new Error('Assignment not found');
        }
        
        setAssignment(foundAssignment);
        return;
      }

      const data = await response.json();
      setAssignment(data.data || data);
    } catch (err: any) {
      console.error('Error fetching assignment:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) {
      return { status: 'Overdue', color: 'red', icon: ExclamationTriangleIcon };
    } else if (diffDays === 0) {
      return { status: 'Due Today', color: 'yellow', icon: ClockIcon };
    } else if (diffDays <= 3) {
      return { status: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: 'orange', icon: ClockIcon };
    } else {
      return { status: `Due in ${diffDays} days`, color: 'green', icon: CheckCircleIcon };
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchAssignmentDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading assignment details...</p>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignment Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The assignment you requested could not be found.'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(assignment.dueDate);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-600 text-white mb-8 rounded-2xl shadow-2xl">
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
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{assignment.title}</h1>
              <p className="text-blue-100 mt-1">{assignment.course?.code} - {assignment.course?.name}</p>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
              <StatusIcon className="h-5 w-5" />
              <span className="font-medium">{statusInfo.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Description */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{assignment.instructions}</p>
              </div>
            </Card>

            {/* Submissions Section */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submissions</h2>
              <div className="text-center py-8">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No submissions yet</p>
                <p className="text-sm text-gray-400">Students haven't submitted their assignments yet. Submissions will appear here once students start submitting.</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Details */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Assignment Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Maximum Marks</label>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{assignment.maxMarks}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900 mt-1">{new Date(assignment.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Submissions</span>
                  <span className="font-bold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Graded</span>
                  <span className="font-bold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-bold text-gray-900">-</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Edit Assignment
                </Button>
                <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  View Submissions
                </Button>
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Grade Submissions
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
