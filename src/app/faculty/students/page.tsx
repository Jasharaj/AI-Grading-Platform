'use client';

import React, { useState } from 'react';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { Select } from '@/app/components/common/Select';
import { Table } from '@/app/components/common/Table';
import { Input } from '@/app/components/common/Input';
import { toast } from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  assignments: {
    id: string;
    title: string;
    submitted: boolean;
    grade?: number;
  }[];
}

interface Course {
  id: string;
  name: string;
}

export default function StudentManagement() {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNumber: '',
  });

  // Mock data - in real app, this would come from an API
  const courses: Course[] = [
    { id: 'cs101', name: 'Introduction to Computer Science' },
    { id: 'cs201', name: 'Data Structures' },
    { id: 'cs301', name: 'Algorithms' },
  ];

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      rollNumber: 'CS2023001',
      assignments: [
        { id: '1', title: 'Assignment 1', submitted: true, grade: 85 },
        { id: '2', title: 'Assignment 2', submitted: false },
      ],
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      rollNumber: 'CS2023002',
      assignments: [
        { id: '1', title: 'Assignment 1', submitted: true, grade: 92 },
        { id: '2', title: 'Assignment 2', submitted: true, grade: 88 },
      ],
    },
  ]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      toast.error('Please select a course first');
      return;
    }

    const newStudentData: Student = {
      id: Date.now().toString(),
      ...newStudent,
      assignments: [],
    };

    setStudents(prev => [...prev, newStudentData]);
    setNewStudent({ name: '', email: '', rollNumber: '' });
    setShowAddForm(false);
    toast.success('Student added successfully!');
  };

  const handleRemoveStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to remove this student from the course?')) {
      setStudents(prev => prev.filter(student => student.id !== studentId));
      toast.success('Student removed successfully!');
    }
  };

  const studentColumns = [
    { key: 'name', header: 'Name' },
    { key: 'rollNumber', header: 'Roll Number' },
    { key: 'email', header: 'Email' },
    { 
      key: 'assignments', 
      header: 'Assignment Status',
      render: (_: any, student: Student) => (
        <div className="space-y-1">
          {student.assignments.map(assignment => (
            <div key={assignment.id} className="flex items-center space-x-2">
              <span className="text-sm text-black">{assignment.title}:</span>
              {assignment.submitted ? (
                <span className="text-sm text-green-600">
                  Submitted {assignment.grade ? `(Grade: ${assignment.grade})` : '(Not Graded)'}
                </span>
              ) : (
                <span className="text-sm text-red-600">Not Submitted</span>
              )}
            </div>
          ))}
        </div>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_: any, student: Student) => (
        <Button 
          variant="text" 
          color="danger" 
          onClick={() => handleRemoveStudent(student.id)}
        >
          Remove
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Student Management</h1>
      </div>

      <Card>
        <div className="mb-6">
          <Select
            label="Select Course"
            options={[
              { value: '', label: 'Select a course' },
              ...courses.map(course => ({ 
                value: course.id, 
                label: course.name 
              }))
            ]}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          />
        </div>

        {selectedCourse && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowAddForm(true)} variant="primary">
                Add Student
              </Button>
            </div>

            {showAddForm && (
              <Card>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <Input
                    label="Name"
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                  <Input
                    label="Roll Number"
                    type="text"
                    required
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                  />
                  <div className="flex justify-end space-x-3">
                    <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      Add Student
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <Table
              columns={studentColumns}
              data={students}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
