'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EvaluationRow from '@/app/components/EvaluationRow';
import { Select } from '@/app/components/common/Select';
import { Input } from '@/app/components/common/Input';
import { useSubmissionStore } from '@/app/store/submissions';

// Loading component
function LoadingState() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main component
function EvaluateContent() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('submissionId');
  
  const { addSubmission, updateSubmission, getSubmissionById } = useSubmissionStore();

  const students = [
    { id: 'STU001', name: 'John Doe', courseId: 'CS101' },
    { id: 'STU002', name: 'Jane Smith', courseId: 'CS202' },
    { id: 'STU003', name: 'Mike Johnson', courseId: 'CS101' },
  ];

  const courseOptions = [
    { value: '', label: 'All Courses' },
    { value: 'CS101', label: 'CS101' },
    { value: 'CS202', label: 'CS202' },
    { value: 'CS303', label: 'CS303' },
  ];

  const handleSubmitEvaluation = (evaluation: {
    studentName: string;
    studentId: string;
    courseId: string;
    review: string;
    grade: string;
    feedback: string;
  }) => {
    if (submissionId) {
      updateSubmission({
        id: submissionId,
        ...evaluation,
        submittedDate: new Date().toISOString().split('T')[0],
        isEditing: false
      });
    } else {
      const newSubmission = {
        id: `SUB${Math.random().toString(36).substr(2, 9)}`,
        ...evaluation,
        submittedDate: new Date().toISOString().split('T')[0],
      };
      addSubmission(newSubmission);
    }
    
    router.push('/ta/submissions');
  };

  const filteredStudents = students.filter(student => {
    if (submissionId) {
      const submission = getSubmissionById(submissionId);
      return submission && student.id === submission.studentId;
    }

    const matchesCourse = !selectedCourse || student.courseId === selectedCourse;
    const matchesSearch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {submissionId ? 'Edit Evaluation' : 'Evaluate Students'}
      </h1>

      {!submissionId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Select
            options={courseOptions}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            defaultOption="Select Course"
          />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-6">
        {filteredStudents.map((student) => (
          <EvaluationRow
            key={student.id}
            student={student}
            onSubmit={handleSubmitEvaluation}
            initialSubmission={submissionId ? getSubmissionById(submissionId) : undefined}
          />
        ))}
        {filteredStudents.length === 0 && (
          <p className="text-gray-500 text-center py-8">No students found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

// Export default component with Suspense
export default function Evaluate() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EvaluateContent />
    </Suspense>
  );
}
