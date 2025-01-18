'use client';

import { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import StatusChip, { Status } from '../../components/StatusChip';
import { BookOpenIcon, ClockIcon, UserGroupIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  students: number;
  status: Status;
  assignments: Assignment[];
}

const courses: Course[] = [
  {
    id: '1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Sarah Johnson',
    schedule: 'Mon, Wed 10:00 AM',
    students: 45,
    status: 'active',
    assignments: [
      {
        id: 'a1',
        title: 'Programming Basics Assignment',
        dueDate: '2025-02-01',
        status: 'pending'
      },
      {
        id: 'a2',
        title: 'Data Structures Project',
        dueDate: '2025-02-15',
        status: 'submitted',
        grade: 85
      }
    ]
  },
  {
    id: '2',
    code: 'MATH201',
    name: 'Advanced Mathematics',
    instructor: 'Prof. Michael Chen',
    schedule: 'Tue, Thu 2:00 PM',
    students: 35,
    status: 'active',
    assignments: [
      {
        id: 'a3',
        title: 'Calculus Assignment',
        dueDate: '2025-02-05',
        status: 'pending'
      }
    ]
  },
  {
    id: '3',
    code: 'PHY101',
    name: 'Physics Fundamentals',
    instructor: 'Dr. James Wilson',
    schedule: 'Wed, Fri 11:00 AM',
    students: 40,
    status: 'upcoming',
    assignments: []
  },
];

export default function AssignmentsPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleFileUpload = (file: File) => {
    if (selectedAssignment) {
      // Here you would typically handle the file upload to your backend
      console.log(`Uploading file ${file.name} for assignment ${selectedAssignment.id}`);
      
      // Update the assignment status
      if (selectedCourse) {
        const updatedCourse = {
          ...selectedCourse,
          assignments: selectedCourse.assignments.map(assignment =>
            assignment.id === selectedAssignment.id
              ? { ...assignment, status: 'submitted' as const }
              : assignment
          )
        };
        setSelectedCourse(updatedCourse);
      }
      
      setShowUploadModal(false);
      setSelectedAssignment(null);
    }
  };

  return (
    <PageContainer
      title="Course Assignments"
      subtitle="View and submit your course assignments"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {course.code}
                  </p>
                </div>
                <StatusChip status={course.status} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="truncate">{course.instructor}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="truncate">{course.schedule}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpenIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="truncate">{course.assignments.length} assignments</span>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => setSelectedCourse(course)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Upload Assignments
                </button>
              </div>
            </div>

            {/* Course Assignments Section */}
            {selectedCourse?.id === course.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Available Assignments</h4>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {course.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <div className="min-w-0 flex-1">
                          <h5 className="text-sm font-medium text-gray-900 truncate">{assignment.title}</h5>
                          <p className="text-sm text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                        </div>
                        <div className="ml-4 flex items-center space-x-2 flex-shrink-0">
                          {assignment.grade && (
                            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                              Grade: {assignment.grade}%
                            </span>
                          )}
                          {assignment.status === 'pending' && (
                            <button
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setShowUploadModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
                            >
                              Upload
                            </button>
                          )}
                          {assignment.status === 'submitted' && (
                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md whitespace-nowrap">
                              Submitted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {course.assignments.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No assignments available yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Upload Assignment
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedAssignment(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                {selectedAssignment?.title}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedAssignment(null);
                }}
                className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
