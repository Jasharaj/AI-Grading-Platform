'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/app/components/common/Card';
import { AssignmentFormModern } from '@/app/components/faculty/AssignmentFormModern';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import { 
  PlusIcon, 
  FunnelIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  course: {
    _id: string;
    name: string;
    code: string;
  };
  maxMarks: number;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export default function AssignmentManagement() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching Faculty assignments...');
      
      const response = await fetch(`${BASE_URL}/faculty/assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          setLoading(false);
          return;
        } else if (response.status === 403) {
          setError('Access denied. You may not have Faculty permissions.');
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch assignments: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Assignments data received:', data);
      
      if (!data.success || !data.data) {
        throw new Error('Invalid assignments data received');
      }
      
      setAssignments(data.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchAssignments();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const getStatusColor = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return 'text-red-600 bg-red-100';
    if (diffDays <= 3) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusText = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `${diffDays} days left`;
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/faculty/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }

      console.log('Assignment deleted successfully');
      fetchAssignments(); // Refresh the list
    } catch (err) {
      console.error('Error deleting assignment:', err);
      alert('Failed to delete assignment');
    }
  };

  const handleViewAssignment = (assignment: Assignment) => {
    // Navigate to assignment details page
    window.location.href = `/faculty/assignments/${assignment._id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Assignments</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAssignments}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Mock data for courses - in real app, this would come from an API
  const courses = [
    { id: 'cs101', name: 'Introduction to Computer Science' },
    { id: 'cs201', name: 'Data Structures' },
    { id: 'cs301', name: 'Algorithms' },
  ];

  const handleCreateAssignment = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`${BASE_URL}/faculty/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create assignment');
      }

      const result = await response.json();
      toast.success('Assignment created successfully!');
      setShowForm(false);
      fetchAssignments(); // Refresh the list
    } catch (err) {
      console.error('Error creating assignment:', err);
      toast.error('Failed to create assignment');
    }
  };

  const handleEditAssignment = async (data: any) => {
    if (!editingAssignment) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/faculty/assignments/${editingAssignment._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update assignment');
      }

      toast.success('Assignment updated successfully!');
      setShowForm(false);
      setEditingAssignment(null);
      fetchAssignments(); // Refresh the list
    } catch (err) {
      console.error('Error updating assignment:', err);
      toast.error('Failed to update assignment');
    }
  };

  if (showForm) {
    return (
      <>
        <AssignmentFormModern
          onSubmit={editingAssignment ? handleEditAssignment : handleCreateAssignment}
          onCancel={() => {
            setShowForm(false);
            setEditingAssignment(null);
          }}
          initialData={editingAssignment}
        />
      </>
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
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Assignment Management</h1>
                <p className="text-purple-100 mt-1">Create, manage and track your assignments</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <PlusIcon className="h-5 w-5" />
              <span className="font-medium">Create Assignment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex items-center space-x-3">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white min-w-48"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments
          .filter((assignment) => !selectedCourse || assignment.course.code === selectedCourse)
          .map((assignment) => (
            <div key={assignment._id} className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              {/* Status Bar */}
              <div className={`h-1.5 ${getStatusColor(assignment.dueDate)}`}></div>
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-200 mb-2">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {assignment.description}
                    </p>
                    <p className="text-sm text-purple-600 font-medium mt-1">
                      {assignment.course.code} - {assignment.course.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.dueDate)}`}>
                      {getStatusText(assignment.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Due Date</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>Max Marks</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {assignment.maxMarks}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>Max Marks</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {assignment.maxMarks}
                    </span>
                  </div>
                </div>

                {/* Assignment Info */}
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">
                    Created: {new Date(assignment.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewAssignment(assignment)}
                    className="flex-1 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl hover:bg-purple-100 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingAssignment(assignment);
                      setShowForm(true);
                    }}
                    className="flex-1 bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {assignments.filter((assignment) => !selectedCourse || assignment.course.code === selectedCourse).length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first assignment.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Assignment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
