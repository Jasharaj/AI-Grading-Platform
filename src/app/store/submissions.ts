import { create } from 'zustand';

export interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  courseId: string;
  review: string;
  grade: string;
  feedback: string;
  submittedDate: string;
  isEditing?: boolean;
}

interface SubmissionStore {
  submissions: Submission[];
  addSubmission: (submission: Submission) => void;
  updateSubmission: (submission: Submission) => void;
  getSubmissionById: (id: string) => Submission | undefined;
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  submissions: [
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
  ],
  addSubmission: (submission) => set((state) => ({
    submissions: [...state.submissions, submission]
  })),
  updateSubmission: (updatedSubmission) => set((state) => ({
    submissions: state.submissions.map(submission =>
      submission.id === updatedSubmission.id ? updatedSubmission : submission
    )
  })),
  getSubmissionById: (id) => get().submissions.find(submission => submission.id === id),
}));
