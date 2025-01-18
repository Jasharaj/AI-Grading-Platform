'use client';

import React, { useState } from 'react';
import { Card } from '@/app/components/common/Card';
import { AssignmentForm } from '@/app/components/faculty/AssignmentForm';
import { toast } from 'react-hot-toast';

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'active' | 'completed' | 'draft';
  hasRubric: boolean;
  gradingStatus: 'not_started' | 'in_progress' | 'completed';
  course: string;
  description: string;
  maxMarks: number;
  selectedTAs: string[];
}

export default function AssignmentManagement() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Assignment 1: Programming Basics',
      description: 'Introduction to programming concepts',
      dueDate: '2024-01-30T23:59',
      status: 'active',
      hasRubric: true,
      gradingStatus: 'in_progress',
      course: 'cs101',
      maxMarks: 100,
      selectedTAs: ['1', '2']
    },
    {
      id: '2',
      title: 'Assignment 2: Arrays and Loops',
      description: 'Working with arrays and loops',
      dueDate: '2024-02-15T23:59',
      status: 'draft',
      hasRubric: true,
      gradingStatus: 'not_started',
      course: 'cs101',
      maxMarks: 100,
      selectedTAs: ['2']
    }
  ]);

  // Mock data - in real app, this would come from an API
  const courses = [
    { id: 'cs101', name: 'Introduction to Computer Science' },
    { id: 'cs201', name: 'Data Structures' },
    { id: 'cs301', name: 'Algorithms' },
  ];

  const handleCreateAssignment = (data: Partial<Assignment>) => {
    const newAssignment: Assignment = {
      id: Date.now().toString(), // In real app, this would come from the backend
      title: data.title || '',
      description: data.description || '',
      dueDate: data.dueDate || new Date().toISOString(),
      status: 'draft',
      hasRubric: !!data.hasRubric,
      gradingStatus: 'not_started',
      course: selectedCourse || courses[0].id,
      maxMarks: data.maxMarks || 0,
      selectedTAs: data.selectedTAs || []
    };

    setAssignments(prev => [...prev, newAssignment]);
    setShowForm(false);
    toast.success('Assignment created successfully!');
  };

  const handleEditAssignment = (data: Partial<Assignment>) => {
    if (!editingAssignment) return;

    setAssignments(prev => prev.map(assignment => 
      assignment.id === editingAssignment.id 
        ? { 
            ...assignment, 
            ...data,
            hasRubric: !!data.hasRubric 
          }
        : assignment
    ));
    
    setShowForm(false);
    setEditingAssignment(null);
    toast.success('Assignment updated successfully!');
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
      toast.success('Assignment deleted successfully!');
    }
  };

  const getStatusBadgeClass = (status: Assignment['status']) => {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
      case 'active':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'draft':
        return `${baseClasses} bg-black/10 text-black`;
      default:
        return baseClasses;
    }
  };

  const getGradingStatusBadgeClass = (status: Assignment['gradingStatus']) => {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
      case 'not_started':
        return `${baseClasses} bg-black/10 text-black`;
      case 'in_progress':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return baseClasses;
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <AssignmentForm
          onSubmit={editingAssignment ? handleEditAssignment : handleCreateAssignment}
          onCancel={() => {
            setShowForm(false);
            setEditingAssignment(null);
          }}
          initialData={editingAssignment}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Assignment Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Create New Assignment
        </button>
      </div>

      <Card>
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">Select Course</label>
          <select
            className="w-full rounded-md border border-black/20 px-3 py-2 text-black focus:border-purple-500 focus:ring-purple-500"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="" className="text-black">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id} className="text-black">
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-black/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Grading Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Rubric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/10">
              {assignments
                .filter((assignment) => !selectedCourse || assignment.course === selectedCourse)
                .map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-black">
                      {assignment.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-black">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(assignment.status)}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getGradingStatusBadgeClass(assignment.gradingStatus)}>
                        {assignment.gradingStatus.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assignment.hasRubric ? (
                        <span className="text-purple-600">Yes</span>
                      ) : (
                        <span className="text-black/40">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => {
                          setEditingAssignment(assignment);
                          setShowForm(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
