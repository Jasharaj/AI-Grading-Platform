'use client';

import React from 'react';
import SubmissionCard from '@/app/components/SubmissionCard';

export default function Submissions() {
  // Dummy data for submissions
  const submissions = [
    {
      id: 'SUB001',
      studentName: 'John Doe',
      studentId: 'STU001',
      courseId: 'CS101',
      review: 'The assignment demonstrates good understanding of core concepts. Code structure is well-organized, but there\'s room for improvement in error handling.',
      grade: 'A',
      feedback: 'Great work on implementing the main algorithms. Consider adding more comprehensive error handling and input validation in future submissions.',
      submittedDate: '2024-01-15',
    },
    {
      id: 'SUB002',
      studentName: 'Jane Smith',
      studentId: 'STU002',
      courseId: 'CS202',
      review: 'Excellent project implementation with proper documentation. The code follows best practices and includes comprehensive test cases.',
      grade: 'Ex',
      feedback: 'Outstanding work! Your attention to detail and thorough documentation make this submission exemplary. The test coverage is particularly impressive.',
      submittedDate: '2024-01-16',
    },
    {
      id: 'SUB003',
      studentName: 'Mike Johnson',
      studentId: 'STU003',
      courseId: 'CS101',
      review: 'The submission meets basic requirements but lacks some key implementation details. Code organization could be improved.',
      grade: 'B',
      feedback: 'While the basic functionality is implemented correctly, consider improving code organization and adding more comments to explain complex logic.',
      submittedDate: '2024-01-17',
    },
  ];

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full overflow-y-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Filters - Fixed */}
          <div className="sticky top-0 bg-gray-50 pt-6 pb-4 z-10">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Submission Details</h1>
              
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">All Courses</option>
                  <option value="CS101">CS101</option>
                  <option value="CS202">CS202</option>
                  <option value="CS303">CS303</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">All Grades</option>
                  <option value="Ex">Ex (Excellent)</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="P">P (Pass)</option>
                  <option value="F">F (Fail)</option>
                </select>
                <input
                  type="text"
                  placeholder="Search students..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-purple-600">45</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-600">Graded</p>
                <p className="text-2xl font-bold text-green-600">38</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">7</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-blue-600">B+</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-6 pb-6">
            {submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
