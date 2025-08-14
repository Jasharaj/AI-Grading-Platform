'use client';

import { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';
import { 
  XMarkIcon, 
  BookOpenIcon,
  SparklesIcon,
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Course {
  _id?: string;
  name: string;
  code: string;
  description: string;
  semester: string;
  year: number;
  isActive?: boolean;
  students?: string[]; // Array of student IDs
}

interface Student {
  _id: string;
  name: string;
  email: string;
  studentId: string;
}

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Course) => Promise<void>;
  initialData?: Course | null;
}

export function CourseFormModern({ isOpen, onClose, onSubmit, initialData }: CourseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    semester: '',
    year: new Date().getFullYear(),
    isActive: true,
    students: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code,
        description: initialData.description,
        semester: initialData.semester,
        year: initialData.year,
        isActive: initialData.isActive || true,
        students: initialData.students || []
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        semester: '',
        year: new Date().getFullYear(),
        isActive: true,
        students: []
      });
    }
  }, [initialData, isOpen]);

  // Fetch available students
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const token = localStorage.getItem('token');
      console.log('Fetching students with token:', !!token);
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${BASE_URL}/faculty/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Students data received:', data);
        const students = data.success ? data.data : data;
        console.log('Processed students:', students);
        setAvailableStudents(Array.isArray(students) ? students : []);
      } else {
        console.error('Response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Load students when form opens
  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  // Update selected students when form data changes
  useEffect(() => {
    if (formData.students.length > 0 && availableStudents.length > 0) {
      const selected = availableStudents.filter(student => 
        formData.students.includes(student._id)
      );
      setSelectedStudents(selected);
    }
  }, [formData.students, availableStudents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addStudent = (student: Student) => {
    if (!formData.students.includes(student._id)) {
      setFormData(prev => ({
        ...prev,
        students: [...prev.students, student._id]
      }));
      setSelectedStudents(prev => [...prev, student]);
    }
    setStudentSearchQuery('');
  };

  const removeStudent = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.filter(id => id !== studentId)
    }));
    setSelectedStudents(prev => prev.filter(student => student._id !== studentId));
  };

  const filteredStudents = availableStudents.filter(student =>
    !formData.students.includes(student._id) &&
    (student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
     student.email.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
     student.studentId.toLowerCase().includes(studentSearchQuery.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-600 text-white p-8">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
                               radial-gradient(circle at 75% 25%, white 2px, transparent 2px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                <BookOpenIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {initialData ? 'Edit Course' : 'Create New Course'}
                </h2>
                <p className="text-blue-100 mt-1">Build an engaging academic experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/30 hover:border-white/50"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Course Name */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <BookOpenIcon className="h-4 w-4 text-blue-600" />
                  <span>Course Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="e.g., Data Structures and Algorithms"
                />
              </div>

              {/* Course Code */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <AcademicCapIcon className="h-4 w-4 text-purple-600" />
                  <span>Course Code *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="e.g., CS301"
                />
              </div>
            </div>

            {/* Course Description */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <SparklesIcon className="h-4 w-4 text-indigo-600" />
                <span>Course Description</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                rows={4}
                placeholder="Describe what this course covers and what students will learn..."
              />
            </div>

            {/* Academic Period */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Semester */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <CalendarIcon className="h-4 w-4 text-green-600" />
                  <span>Semester *</span>
                </label>
                <select
                  required
                  value={formData.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select Semester</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>

              {/* Academic Year */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <ClockIcon className="h-4 w-4 text-orange-600" />
                  <span>Academic Year *</span>
                </label>
                <input
                  type="number"
                  required
                  min="2020"
                  max="2030"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="e.g., 2024"
                />
              </div>
            </div>

            {/* Course Status */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">Course Status</h3>
                  <p className="text-sm text-gray-600">
                    Active courses are visible to students and can accept enrollments
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
            </div>

            {/* Student Enrollment */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <UsersIcon className="h-5 w-5 text-purple-600" />
                      <span>Student Enrollment</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Assign students to this course
                    </p>
                  </div>
                  <div className="text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                    {selectedStudents.length} enrolled
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:ring-0 transition-all duration-200 bg-white"
                    placeholder="Search students by name, email, or student ID..."
                  />
                </div>

                {/* Available Students Grid */}
                {!loadingStudents && availableStudents.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700">Available Students:</h4>
                    <div className="bg-white rounded-xl border border-purple-200 max-h-80 overflow-y-auto p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredStudents.map((student) => (
                          <div
                            key={student._id}
                            onClick={() => addStudent(student)}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate group-hover:text-purple-700">
                                    {student.name}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {student.email}
                                  </div>
                                  <div className="text-xs text-purple-600 font-medium">
                                    {student.studentId}
                                  </div>
                                </div>
                              </div>
                              <PlusIcon className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {filteredStudents.length === 0 && studentSearchQuery && (
                        <div className="text-center py-8">
                          <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No students found matching "{studentSearchQuery}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selected Students */}
                {selectedStudents.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700">Enrolled Students:</h4>
                    <div className="bg-white rounded-xl border border-purple-200 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedStudents.map((student) => (
                          <div
                            key={student._id}
                            className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl border border-purple-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 text-sm truncate">{student.name}</div>
                                <div className="text-xs text-gray-500 truncate">{student.email}</div>
                              </div>
                              <div className="text-xs text-purple-600 font-medium mr-2">
                                {student.studentId}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeStudent(student._id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loadingStudents && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
                    <p className="text-sm text-gray-500">Loading students...</p>
                  </div>
                )}

                {/* Empty State */}
                {!loadingStudents && availableStudents.length === 0 && (
                  <div className="text-center py-8">
                    <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">No students available</p>
                    <p className="text-sm text-gray-400">Contact admin to add students to the system</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{initialData ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  <span>{initialData ? 'Update Course' : 'Create Course'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
