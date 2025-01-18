'use client';

import React, { useState } from 'react';
import SubmissionCard from '@/app/components/SubmissionCard';
import { Card } from '@/app/components/common/Card';
import { Select } from '@/app/components/common/Select';
import { Input } from '@/app/components/common/Input';
import { Badge } from '@/app/components/common/Badge';
import { useSubmissionStore } from '@/app/store/submissions';

export default function Submissions() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const submissions = useSubmissionStore((state) => state.submissions);

  const courseOptions = [
    { value: '', label: 'All Courses' },
    { value: 'CS101', label: 'CS101' },
    { value: 'CS202', label: 'CS202' },
    { value: 'CS303', label: 'CS303' },
  ];

  const gradeOptions = [
    { value: '', label: 'All Grades' },
    { value: 'Ex', label: 'Ex (Excellent)' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'P', label: 'P (Pass)' },
    { value: 'F', label: 'F (Fail)' },
  ];

  // Filter submissions based on selected filters
  const filteredSubmissions = submissions.filter(submission => {
    const matchesCourse = !selectedCourse || submission.courseId === selectedCourse;
    const matchesGrade = !selectedGrade || submission.grade === selectedGrade;
    const matchesSearch = !searchQuery || 
      submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesGrade && matchesSearch;
  });

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter(s => s.grade).length;
  const pendingSubmissions = totalSubmissions - gradedSubmissions;
  const averageGrade = calculateAverageGrade(submissions);

  function calculateAverageGrade(submissions: any[]) {
    const gradePoints: { [key: string]: number } = {
      'Ex': 4.0,
      'A': 3.7,
      'B': 3.3,
      'C': 2.7,
      'D': 2.0,
      'F': 0.0
    };

    const grades = submissions
      .filter(s => s.grade && gradePoints[s.grade])
      .map(s => gradePoints[s.grade]);

    if (grades.length === 0) return 'N/A';

    const average = grades.reduce((a, b) => a + b, 0) / grades.length;
    return average.toFixed(1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Submissions</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Select
              options={courseOptions}
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              defaultOption="Select Course"
            />
            <Select
              options={gradeOptions}
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              defaultOption="Select Grade"
            />
            <Input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
                  </div>
                  <Badge variant="purple" size="md">100%</Badge>
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Graded</p>
                    <p className="text-2xl font-bold text-gray-900">{gradedSubmissions}</p>
                  </div>
                  <Badge variant="green" size="md">
                    {Math.round((gradedSubmissions / totalSubmissions) * 100)}%
                  </Badge>
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingSubmissions}</p>
                  </div>
                  <Badge variant="yellow" size="md">
                    {Math.round((pendingSubmissions / totalSubmissions) * 100)}%
                  </Badge>
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof averageGrade === 'number' ? 
                        averageGrade >= 3.7 ? 'A' :
                        averageGrade >= 3.3 ? 'B+' :
                        averageGrade >= 3.0 ? 'B' :
                        averageGrade >= 2.7 ? 'B-' :
                        averageGrade >= 2.3 ? 'C+' :
                        averageGrade >= 2.0 ? 'C' : 'D'
                        : averageGrade}
                    </p>
                  </div>
                  <Badge variant="blue" size="md">{averageGrade}</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))
          ) : (
            <Card>
              <div className="p-8 text-center">
                <p className="text-gray-500">No submissions found matching your criteria.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
