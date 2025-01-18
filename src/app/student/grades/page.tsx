'use client';

import PageContainer from '../../components/PageContainer';
import StatusChip, { Status } from '../../components/StatusChip';

interface Grade {
  id: string;
  assignment: string;
  course: string;
  grade: number;
  feedback: string;
  submittedDate: string;
  gradedDate: string;
  status: Status;
}

const grades: Grade[] = [
  {
    id: '1',
    assignment: 'Calculus Midterm',
    course: 'Advanced Mathematics',
    grade: 85,
    feedback: 'Good work on derivatives. Need improvement in integration techniques.',
    submittedDate: '2025-01-10',
    gradedDate: '2025-01-15',
    status: 'graded',
  },
  {
    id: '2',
    assignment: 'Programming Assignment 1',
    course: 'Computer Science 101',
    grade: 92,
    feedback: 'Excellent code structure and documentation. Consider optimizing the algorithm.',
    submittedDate: '2025-01-12',
    gradedDate: '2025-01-16',
    status: 'graded',
  },
  {
    id: '3',
    assignment: 'Physics Lab Report',
    course: 'Physics Fundamentals',
    grade: 0,
    feedback: '',
    submittedDate: '2025-01-17',
    gradedDate: '',
    status: 'pending',
  },
];

export default function GradesPage() {
  const calculateAverageGrade = () => {
    const gradedAssignments = grades.filter(g => g.status === 'graded');
    if (gradedAssignments.length === 0) return 0;
    return Math.round(
      gradedAssignments.reduce((acc, curr) => acc + curr.grade, 0) /
      gradedAssignments.length
    );
  };

  return (
    <PageContainer
      title="Grades & Feedback"
      subtitle="View your grades and instructor feedback"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Overall Average</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">{calculateAverageGrade()}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Assignments Completed</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {grades.filter(g => g.status === 'graded').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Pending Grades</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {grades.filter(g => g.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.assignment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {grade.status === 'graded' ? `${grade.grade}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip status={grade.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className={`
                        px-3 py-1 rounded-md text-sm font-medium
                        ${grade.status === 'pending' 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                        }
                      `}
                      disabled={grade.status === 'pending'}
                    >
                      View Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
