'use client';

import React, { useState } from 'react';
import { Card } from '@/app/components/common/Card';
import { Badge } from '@/app/components/common/Badge';
import { Button } from '@/app/components/common/Button';
import { GradeAssignmentModal } from '@/app/components/faculty/GradeAssignmentModal';
import { toast } from 'react-hot-toast';

interface Assignment {
  id: string;
  title: string;
  studentName: string;
  submittedAt: string;
  status: 'pending' | 'graded' | 'reviewed';
  grade?: number;
  feedback?: string;
  file?: string;
}

interface GradingMetrics {
  pendingReviews: number;
  gradedToday: number;
  averageGrade: number;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Assignment 3',
    studentName: 'John Smith',
    submittedAt: '2 hours ago',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Assignment 2',
    studentName: 'Emma Wilson',
    submittedAt: '1 day ago',
    status: 'graded',
    grade: 92,
    feedback: 'Excellent work! Clear explanation of concepts.',
    file: 'assignment2_graded.pdf'
  },
  {
    id: '3',
    title: 'Assignment 1',
    studentName: 'Michael Brown',
    submittedAt: '3 hours ago',
    status: 'pending'
  },
  {
    id: '4',
    title: 'Assignment 3',
    studentName: 'Sarah Davis',
    submittedAt: '2 days ago',
    status: 'graded',
    grade: 88,
    feedback: 'Good work, but could improve on section 3.',
    file: 'sarah_assignment3.pdf'
  },
  {
    id: '5',
    title: 'Assignment 2',
    studentName: 'James Wilson',
    submittedAt: '5 hours ago',
    status: 'pending'
  }
];

const mockMetrics: GradingMetrics = {
  pendingReviews: 12,
  gradedToday: 5,
  averageGrade: 85
};

export default function GradingAndFeedback() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [metrics, setMetrics] = useState<GradingMetrics>(mockMetrics);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleGradeSubmit = (id: string, grade: number, feedback: string, file?: File) => {
    // In a real app, we would upload the file to a server and get a URL back
    const fileName = file ? file.name : undefined;
    
    setAssignments(prev => prev.map(a => 
      a.id === id ? { 
        ...a, 
        grade, 
        feedback, 
        status: 'graded',
        file: fileName // Store the filename
      } : a
    ));
    
    setMetrics(prev => ({
      ...prev,
      pendingReviews: prev.pendingReviews - 1,
      gradedToday: prev.gradedToday + 1,
      averageGrade: Math.round((prev.averageGrade + grade) / 2)
    }));
    
    setSelectedAssignment(null);
    toast.success('Grade submitted successfully!');
  };

  const downloadGradedAssignment = (file: string) => {
    // In a real app, this would trigger a file download
    toast.success(`Downloading ${file}...`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-black">Grading and Feedback</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-black mb-2">Pending Reviews</h3>
          <p className="text-3xl font-bold text-purple-600">{metrics.pendingReviews}</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-black mb-2">Graded Today</h3>
          <p className="text-3xl font-bold text-purple-600">{metrics.gradedToday}</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-black mb-2">Average Grade</h3>
          <p className="text-3xl font-bold text-purple-600">{metrics.averageGrade}%</p>
        </Card>
      </div>

      <Card title="Assignment Submissions">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black/10">
            <thead>
              <tr className="bg-black/5">
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase">Student</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase">Assignment</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase">Submitted</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase">Grade</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-black uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-black/5">
                  <td className="px-6 py-4 text-sm text-black">{assignment.studentName}</td>
                  <td className="px-6 py-4 text-sm text-black">{assignment.title}</td>
                  <td className="px-6 py-4 text-sm text-black">{assignment.submittedAt}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        assignment.status === 'pending' ? 'pending' :
                        assignment.status === 'graded' ? 'success' : 'info'
                      }
                    >
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {assignment.grade ? `${assignment.grade}%` : '-'}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {assignment.status === 'pending' ? (
                      <Button
                        onClick={() => setSelectedAssignment(assignment)}
                      >
                        Grade
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          View
                        </Button>
                        {assignment.file && (
                          <Button
                            variant="success"
                            onClick={() => downloadGradedAssignment(assignment.file!)}
                          >
                            Download
                          </Button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedAssignment && (
        <GradeAssignmentModal
          assignment={selectedAssignment}
          isOpen={true}
          onClose={() => setSelectedAssignment(null)}
          onSubmit={handleGradeSubmit}
        />
      )}
    </div>
  );
}
