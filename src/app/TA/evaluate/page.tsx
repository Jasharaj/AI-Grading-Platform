'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EvaluationRow from '@/app/components/EvaluationRow';
import { Select } from '@/app/components/common/Select';
import { Input } from '@/app/components/common/Input';
import { useSubmissionStore } from '@/app/store/submissions';

export default function Evaluate() {
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
      // Update existing submission
      updateSubmission({
        id: submissionId,
        ...evaluation,
        submittedDate: new Date().toISOString().split('T')[0],
        isEditing: false
      });
    } else {
      // Add new submission
      const newSubmission = {
        id: `SUB${Math.random().toString(36).substr(2, 9)}`,
        ...evaluation,
        submittedDate: new Date().toISOString().split('T')[0],
      };
      addSubmission(newSubmission);
    }
    
    router.push('/ta/submissions');
  };

  // Filter students based on selected course and search query
  const filteredStudents = students.filter(student => {
    // If editing a submission, only show that student
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

      {/* Hide filters when editing */}
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

      {/* Student List */}
      <div className="space-y-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <EvaluationRow
              key={student.id}
              student={student}
              onSubmit={handleSubmitEvaluation}
              initialSubmission={
                submissionId ? getSubmissionById(submissionId) : undefined
              }
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No students found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
