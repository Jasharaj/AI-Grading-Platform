'use client';

import React from 'react';
import EvaluationRow from '@/app/components/EvaluationRow';

export default function Evaluate() {
  // Dummy data for students
  const students = [
    {
      id: 'STU001',
      name: 'John Doe',
      courseId: 'CS101',
    },
    {
      id: 'STU002',
      name: 'Jane Smith',
      courseId: 'CS202',
    },
    {
      id: 'STU003',
      name: 'Mike Johnson',
      courseId: 'CS101',
    },
    {
      id: 'STU004',
      name: 'Sarah Williams',
      courseId: 'CS303',
    },
    {
      id: 'STU005',
      name: 'Tom Brown',
      courseId: 'CS202',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Evaluate Students</h1>
        <div className="flex items-center space-x-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">All Courses</option>
            <option value="CS101">CS101</option>
            <option value="CS202">CS202</option>
            <option value="CS303">CS303</option>
          </select>
          <input
            type="text"
            placeholder="Search students..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {students.map((student) => (
          <EvaluationRow key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}
