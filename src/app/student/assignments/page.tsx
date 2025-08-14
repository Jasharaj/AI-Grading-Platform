'use client';

import { useState, useEffect } from 'react';
import StatusChip, { Status } from '../../components/StatusChip';
import { BookOpenIcon, ClockIcon, UserGroupIcon, DocumentIcon, XMarkIcon, CalendarIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import toast from 'react-hot-toast';
import { uploadPDFToCloudinary } from '../../utils/uploadCloudinary';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  submissionStatus: 'pending' | 'submitted' | 'graded';
  grade?: number;
  maxMarks?: number;
  course?: {
    _id: string;
    name: string;
    code: string;
  };
  createdBy?: {
    _id: string;
    name: string;
  };
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
}

export default function AssignmentsPage() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const API_BASE_URL = BASE_URL;

  // Fetch assignments from backend
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!token) {
        console.log('No token available for fetching assignments');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching assignments from:', `${API_BASE_URL}/students/assignments`);
        
        const response = await fetch(`${API_BASE_URL}/students/assignments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Assignments response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Assignments error response:', errorText);
          throw new Error(`Failed to fetch assignments: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Assignments data received:', data);
        
        if (data.success && data.data) {
          setAssignments(data.data);
        } else {
          throw new Error(data.message || 'Failed to load assignments');
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast.error(`Failed to load assignments: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Set fallback empty assignments for development
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token, API_BASE_URL]);

  const validatePDF = (file: File): boolean => {
    // Check file type
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return false;
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return false;
    }
    
    return true;
  };

  const handleFileUpload = (file: File) => {
    if (validatePDF(file)) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile && selectedAssignment && token) {
      setUploading(true);
      
      try {
        // Upload file to Cloudinary
        toast.loading('Uploading file...', { id: 'upload' });
        const cloudinaryUrl = await uploadPDFToCloudinary(selectedFile);
        toast.dismiss('upload');
        
        if (!cloudinaryUrl) {
          throw new Error('Failed to upload file');
        }

        // Submit assignment to backend
        toast.loading('Submitting assignment...', { id: 'submit' });
        const response = await fetch(`${API_BASE_URL}/students/assignments/${selectedAssignment._id}/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            answerSheetUrl: cloudinaryUrl
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit assignment');
        }

        const data = await response.json();
        
        if (data.success) {
          // Update assignment status locally
          setAssignments(prev => prev.map(assignment => 
            assignment._id === selectedAssignment._id 
              ? { ...assignment, submissionStatus: 'submitted' as const, submittedAt: new Date().toISOString() }
              : assignment
          ));
          
          toast.dismiss('submit');
          toast.success('Assignment submitted successfully!');
          
          // Close modal
          setShowUploadModal(false);
          setSelectedAssignment(null);
          setSelectedFile(null);
        } else {
          throw new Error(data.message || 'Failed to submit assignment');
        }
      } catch (error) {
        console.error('Error submitting assignment:', error);
        toast.dismiss('submit');
        toast.dismiss('upload');
        toast.error(error instanceof Error ? error.message : 'Failed to submit assignment');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, white 2px, transparent 2px),
                             radial-gradient(circle at 70% 80%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <BookOpenIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">My Assignments</h1>
                <p className="text-emerald-100">View and submit your assignments</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/student/grades"
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <AcademicCapIcon className="w-5 h-5" />
                <span>View Grades</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      ) : (
        <>
          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assignments.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BookOpenIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                <p className="text-gray-500">Check back later for new assignments from your instructors.</p>
              </div>
            ) : (
              assignments.map((assignment, index) => (
                <div
                  key={assignment._id}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Assignment status indicator */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${
                    assignment.submissionStatus === 'submitted' ? 'bg-green-500' : 
                    assignment.submissionStatus === 'graded' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}></div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors mb-2 line-clamp-2">
                          {assignment.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                          {assignment.course?.code || 'No Course'}
                        </p>
                      </div>
                      <StatusChip status={
                        assignment.submissionStatus === 'submitted' ? 'submitted' : 
                        assignment.submissionStatus === 'graded' ? 'graded' : 
                        'pending'
                      } />
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                          <UserGroupIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{assignment.createdBy?.name || 'Unknown Instructor'}</p>
                          <p className="text-xs text-gray-500">{assignment.course?.name || 'No course name'}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                          <CalendarIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      {assignment.maxMarks && (
                        <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                            <AcademicCapIcon className="w-4 h-4 text-purple-600" />
                          </div>
                          <span>Max Marks: {assignment.maxMarks}</span>
                        </div>
                      )}
                      {assignment.grade && (
                        <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                            <AcademicCapIcon className="w-4 h-4 text-green-600" />
                          </div>
                          <span>Grade: {assignment.grade}/{assignment.maxMarks}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {assignment.submissionStatus === 'pending' && (
                        <button 
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowUploadModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center space-x-2"
                        >
                          <DocumentIcon className="w-5 h-5" />
                          <span>Submit Assignment</span>
                        </button>
                      )}
                      {assignment.submissionStatus === 'submitted' && (
                        <div className="w-full bg-green-100 text-green-800 px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 border border-green-200">
                          <span>✓ Submitted</span>
                          {assignment.submittedAt && (
                            <span className="text-sm">
                              on {new Date(assignment.submittedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                      {assignment.submissionStatus === 'graded' && (
                        <div className="w-full bg-blue-100 text-blue-800 px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 border border-blue-200">
                          <span>★ Graded</span>
                          {assignment.grade && assignment.maxMarks && (
                            <span className="text-sm">
                              - {Math.round((assignment.grade / assignment.maxMarks) * 100)}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedAssignment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Upload Assignment
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedAssignment(null);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-gray-500"
                disabled={uploading}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">{selectedAssignment.title}</h4>
              <p className="text-sm text-gray-500">
                Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
              </p>
              {selectedAssignment.maxMarks && (
                <p className="text-sm text-gray-500">
                  Max Marks: {selectedAssignment.maxMarks}
                </p>
              )}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select PDF file to upload
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        disabled={uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF files only, up to 10MB
                  </p>
                  {selectedFile && (
                    <div className="mt-3">
                      <p className="text-sm text-emerald-600 font-medium">
                        ✓ {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedAssignment(null);
                  setSelectedFile(null);
                }}
                disabled={uploading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedFile || uploading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:cursor-not-allowed flex items-center space-x-2 ${
                  selectedFile && !uploading
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {uploading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{uploading ? 'Uploading...' : 'Submit Assignment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
