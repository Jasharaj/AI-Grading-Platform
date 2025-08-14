'use client';

import StatusChip, { Status } from '../../components/StatusChip';
import { ChartBarIcon, DocumentIcon, ClockIcon, CheckCircleIcon, CalendarIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import toast from 'react-hot-toast';

interface Grade {
  _id: string;
  grade: number;
  feedback?: string;
  gradedAt: string;
  submittedAt: string;
  assignment: {
    _id: string;
    title: string;
    maxMarks: number;
    course?: {
      name: string;
      code: string;
    };
  };
  status?: 'graded' | 'submitted' | 'pending';
}

export default function GradesPage() {
  const { token } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = BASE_URL;

  // Debug logging
  useEffect(() => {
    console.log('Grades state:', grades, 'isArray:', Array.isArray(grades));
  }, [grades]);

  // Fetch grades from backend
  useEffect(() => {
    const fetchGrades = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching grades from:', `${API_BASE_URL}/students/grades`);
        
        const response = await fetch(`${API_BASE_URL}/students/grades`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Grades response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Grades error response:', errorText);
          throw new Error(`Failed to fetch grades: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Grades data received:', data);
        
        if (data.success && data.data && Array.isArray(data.data.grades)) {
          setGrades(data.data.grades);
        } else if (data.success && Array.isArray(data.data)) {
          // Handle case where grades might be directly in data.data
          setGrades(data.data);
        } else {
          console.warn('Unexpected data structure:', data);
          setGrades([]); // Ensure it's always an array
          throw new Error(data.message || 'Failed to load grades');
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
        toast.error(`Failed to load grades: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setGrades([]); // Ensure it's always an array even on error
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [token, API_BASE_URL]);

  const calculateAverageGrade = () => {
    // Ensure grades is an array before trying to filter
    if (!Array.isArray(grades)) {
      console.error('Grades is not an array:', grades);
      return 0;
    }
    
    const gradedAssignments = grades.filter(g => g.grade !== undefined && g.grade !== null);
    if (gradedAssignments.length === 0) return 0;
    return Math.round(
      gradedAssignments.reduce((acc, curr) => acc + curr.grade, 0) /
      gradedAssignments.length
    );
  };

  const getGradePercentage = (grade: Grade) => {
    return Math.round((grade.grade / grade.assignment.maxMarks) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading grades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white rounded-2xl shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 40% 60%, white 2px, transparent 2px),
                             radial-gradient(circle at 60% 40%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Grades & Feedback</h1>
                <p className="text-blue-100">Track your academic performance and view instructor feedback</p>
              </div>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/student/assignments"
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <DocumentIcon className="w-5 h-5" />
                <span>Assignments</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-2">Overall Average</p>
          <p className="text-3xl font-bold text-purple-600">{calculateAverageGrade()}%</p>
          <p className="text-xs text-gray-500 mt-2">Based on graded assignments</p>
        </div>
        
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-2">Assignments Completed</p>
          <p className="text-3xl font-bold text-green-600">
            {Array.isArray(grades) ? grades.filter(g => g.grade !== undefined && g.grade !== null).length : 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Successfully graded</p>
        </div>
        
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
              <ClockIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-2">Total Assignments</p>
          <p className="text-3xl font-bold text-orange-600">{Array.isArray(grades) ? grades.length : 0}</p>
          <p className="text-xs text-gray-500 mt-2">All submissions</p>
        </div>
      </div>

      {/* Enhanced Grades List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Grade Details</h3>
          <p className="text-gray-600 mt-1">View your assignment grades and feedback</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {!Array.isArray(grades) || grades.length === 0 ? (
            <div className="p-12 text-center">
              <ChartBarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No grades yet</h3>
              <p className="text-gray-500">Your grades will appear here once assignments are graded.</p>
            </div>
          ) : (
            grades.map((grade, index) => (
              <div 
                key={grade._id} 
                className="group p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      ${getGradePercentage(grade) >= 80 ? 'bg-green-100 text-green-600' : 
                        getGradePercentage(grade) >= 60 ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-red-100 text-red-600'}`}>
                      <ChartBarIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                        {grade.assignment.title}
                      </h4>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        {grade.assignment.course?.name || 'No course'}
                      </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500 flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Submitted: {new Date(grade.submittedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Graded: {new Date(grade.gradedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      getGradePercentage(grade) >= 90 ? 'text-green-600' :
                      getGradePercentage(grade) >= 80 ? 'text-blue-600' :
                      getGradePercentage(grade) >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {grade.grade}/{grade.assignment.maxMarks}
                    </div>
                    <div className="text-xs text-gray-500">{getGradePercentage(grade)}%</div>
                  </div>
                </div>
              </div>
              
              {/* Feedback Section */}
              {grade.feedback && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">Instructor Feedback:</h5>
                  <p className="text-sm text-blue-800">{grade.feedback}</p>
                </div>
              )}
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
}
