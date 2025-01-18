'use client';

import React, { useState } from 'react';
import { Card } from '@/app/components/common/Card';
import { Button } from '@/app/components/common/Button';
import { Select } from '@/app/components/common/Select';
import { Progress } from '@/app/components/common/Progress';
import { Table } from '@/app/components/common/Table';
import { toast } from 'react-hot-toast';

interface TA {
  taId: string;
  name: string;
  email: string;
  assignedCourses: string[];
  gradingMetrics: {
    courseId: string;
    assignmentsGraded: number;
    pendingAssignments: number;
    averageGradingTime: number;
  }[];
}

interface Course {
  id: string;
  name: string;
  assignedTAs: string[];
}

interface Assignment {
  id: string;
  title: string;
  courseId: string;
  assignedTA: string;
  totalSubmissions: number;
  gradedSubmissions: number;
}

const validateTaId = (taId: string): boolean => /^TA\d{3}$/.test(taId);

const TACard = ({ ta, courses, onRemove }: { ta: TA; courses: Course[]; onRemove: (taId: string) => void }) => (
  <Card className="h-full">
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-black">{ta.name}</h3>
          <p className="text-sm text-black/60 mt-1">ID: {ta.taId}</p>
          <p className="text-sm text-black/60">{ta.email}</p>
        </div>
        <Button variant="text" color="danger" onClick={() => onRemove(ta.taId)}>
          Remove
        </Button>
      </div>
      <div className="space-y-3">
        <h4 className="font-medium text-black">Assigned Courses:</h4>
        <div className="space-y-4">
          {ta.assignedCourses.map((courseId) => {
            const course = courses.find(c => c.id === courseId);
            const metrics = ta.gradingMetrics.find(m => m.courseId === courseId);
            return (
              <div key={courseId} className="bg-black/5 p-3 rounded-lg">
                <p className="font-medium text-black mb-2">{course?.name}</p>
                {metrics && (
                  <div className="grid grid-cols-2 gap-2 text-sm text-black/60">
                    <span>Graded: {metrics.assignmentsGraded}</span>
                    <span>Pending: {metrics.pendingAssignments}</span>
                    <span>Avg. Time: {metrics.averageGradingTime}min</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </Card>
);

export default function TAManagement() {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isNewTA, setIsNewTA] = useState(false);
  const [taInfo, setTaInfo] = useState({ taId: '', name: '', email: '' });

  const [courses] = useState<Course[]>([
    { id: 'cs101', name: 'Introduction to Computer Science', assignedTAs: ['TA001', 'TA002'] },
    { id: 'cs201', name: 'Data Structures', assignedTAs: ['TA002'] },
  ]);

  const [tas, setTAs] = useState<TA[]>([
    {
      taId: 'TA001',
      name: 'Alex Johnson',
      email: 'alex@university.edu',
      assignedCourses: ['cs101'],
      gradingMetrics: [{ courseId: 'cs101', assignmentsGraded: 45, pendingAssignments: 5, averageGradingTime: 15 }],
    },
    {
      taId: 'TA002',
      name: 'Sarah Williams',
      email: 'sarah@university.edu',
      assignedCourses: ['cs101', 'cs201'],
      gradingMetrics: [
        { courseId: 'cs101', assignmentsGraded: 50, pendingAssignments: 0, averageGradingTime: 12 },
        { courseId: 'cs201', assignmentsGraded: 35, pendingAssignments: 15, averageGradingTime: 18 },
      ],
    },
  ]);

  const [assignments] = useState<Assignment[]>([
    { id: '1', title: 'Programming Basics', courseId: 'cs101', assignedTA: 'TA001', totalSubmissions: 50, gradedSubmissions: 45 },
    { id: '2', title: 'Arrays and Loops', courseId: 'cs101', assignedTA: 'TA002', totalSubmissions: 50, gradedSubmissions: 50 },
  ]);

  const handleAssignTA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    if (isNewTA) {
      if (!validateTaId(taInfo.taId)) {
        toast.error('TA ID must be in format TA### (e.g., TA001)');
        return;
      }
      if (tas.some(ta => ta.taId === taInfo.taId)) {
        toast.error('TA ID already exists');
        return;
      }
      setTAs(prev => [...prev, {
        ...taInfo,
        assignedCourses: [selectedCourse],
        gradingMetrics: [{
          courseId: selectedCourse,
          assignmentsGraded: 0,
          pendingAssignments: 0,
          averageGradingTime: 0
        }],
      }]);
      toast.success('New TA added and assigned to course successfully!');
    } else {
      const ta = tas.find(t => t.taId === taInfo.taId);
      if (!ta) {
        toast.error('Please select a valid TA');
        return;
      }
      if (ta.assignedCourses.includes(selectedCourse)) {
        toast.error('TA is already assigned to this course');
        return;
      }
      setTAs(prev => prev.map(t => t.taId === taInfo.taId ? {
        ...t,
        assignedCourses: [...t.assignedCourses, selectedCourse],
        gradingMetrics: [...t.gradingMetrics, {
          courseId: selectedCourse,
          assignmentsGraded: 0,
          pendingAssignments: 0,
          averageGradingTime: 0
        }]
      } : t));
      toast.success('TA assigned to course successfully!');
    }
    resetForm();
  };

  const resetForm = () => {
    setShowAssignForm(false);
    setSelectedCourse('');
    setTaInfo({ taId: '', name: '', email: '' });
    setIsNewTA(false);
  };

  const handleRemoveTA = (taId: string) => {
    if (assignments.some(a => a.assignedTA === taId)) {
      toast.error('Cannot remove TA with active assignments. Please reassign their tasks first.');
      return;
    }
    if (window.confirm('Are you sure you want to remove this TA?')) {
      setTAs(prev => prev.filter(ta => ta.taId !== taId));
      toast.success('TA removed successfully!');
    }
  };

  const handleReassignTask = (assignmentId: string, newTaId: string) => {
    if (!newTaId) return;
    const assignment = assignments.find(a => a.id === assignmentId);
    const newTA = tas.find(ta => ta.taId === newTaId);
    if (assignment && newTA && !newTA.assignedCourses.includes(assignment.courseId)) {
      toast.error('Selected TA is not assigned to this course');
      return;
    }
    toast.success('Assignment reassigned successfully!');
  };

  const assignmentColumns = [
    { key: 'title', header: 'Assignment' },
    { key: 'courseId', header: 'Course', render: (_: any, row: Assignment) => courses.find(c => c.id === row.courseId)?.name },
    { key: 'assignedTA', header: 'Assigned TA', render: (_: any, value: string) => {
      const ta = tas.find(t => t.taId === value);
      return `${ta?.taId} - ${ta?.name}`;
    }},
    { key: 'progress', header: 'Progress', render: (_: any, row: Assignment) => (
      <Progress value={row.gradedSubmissions} max={row.totalSubmissions} />
    )},
    { key: 'actions', header: 'Actions', render: (_: any, row: Assignment) => (
      <Select
        options={[
          { value: '', label: 'Reassign to' },
          ...tas
            .filter(ta => ta.taId !== row.assignedTA)
            .map(ta => ({ value: ta.taId, label: `${ta.taId} - ${ta.name}` }))
        ]}
        value=""
        onChange={(e) => handleReassignTask(row.id, e.target.value)}
      />
    )}
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">TA Management</h1>
        <Button variant="primary" onClick={() => setShowAssignForm(true)}>
          Assign TA to Course
        </Button>
      </div>

      {showAssignForm && (
        <Card className="mb-8">
          <form onSubmit={handleAssignTA} className="space-y-6 p-2">
            <div className="grid grid-cols-1 gap-6">
              <Select
                options={[
                  { value: '', label: 'Select a course' },
                  ...courses.map(c => ({ value: c.id, label: c.name }))
                ]}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              />

              <div className="flex items-center space-x-6">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    checked={!isNewTA} 
                    onChange={() => setIsNewTA(false)}
                    className="form-radio text-purple-600 h-5 w-5" 
                  />
                  <span className="ml-2 text-black">Existing TA</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    checked={isNewTA} 
                    onChange={() => setIsNewTA(true)}
                    className="form-radio text-purple-600 h-5 w-5" 
                  />
                  <span className="ml-2 text-black">New TA</span>
                </label>
              </div>

              {isNewTA ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    required 
                    placeholder="TA ID (e.g., TA001)" 
                    value={taInfo.taId}
                    onChange={(e) => setTaInfo({ ...taInfo, taId: e.target.value })}
                    className="w-full rounded-lg border border-black/20 px-4 py-2.5 text-black focus:border-purple-500" 
                  />
                  <input 
                    type="text" 
                    required 
                    placeholder="Name" 
                    value={taInfo.name}
                    onChange={(e) => setTaInfo({ ...taInfo, name: e.target.value })}
                    className="w-full rounded-lg border border-black/20 px-4 py-2.5 text-black focus:border-purple-500" 
                  />
                  <input 
                    type="email" 
                    required 
                    placeholder="Email" 
                    value={taInfo.email}
                    onChange={(e) => setTaInfo({ ...taInfo, email: e.target.value })}
                    className="md:col-span-2 w-full rounded-lg border border-black/20 px-4 py-2.5 text-black focus:border-purple-500" 
                  />
                </div>
              ) : (
                <Select
                  options={[
                    { value: '', label: 'Select a TA' },
                    ...tas.map(ta => ({ value: ta.taId, label: `${ta.taId} - ${ta.name}` }))
                  ]}
                  value={taInfo.taId}
                  onChange={(e) => {
                    const selectedTA = tas.find(ta => ta.taId === e.target.value);
                    if (selectedTA) setTaInfo(selectedTA);
                  }}
                />
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {isNewTA ? 'Add & Assign TA' : 'Assign TA'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Teaching Assistants" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tas.map(ta => <TACard key={ta.taId} ta={ta} courses={courses} onRemove={handleRemoveTA} />)}
        </div>
      </Card>

      <Card title="Assignment Distribution">
        <Table 
          columns={assignmentColumns}
          data={assignments}
        />
      </Card>
    </div>
  );
}
