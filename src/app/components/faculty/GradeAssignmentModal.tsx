import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface Assignment {
  id: string;
  title: string;
  studentName: string;
  grade?: number;
  feedback?: string;
}

interface GradeAssignmentModalProps {
  assignment: Assignment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, grade: number, feedback: string, file?: File) => void;
}

export const GradeAssignmentModal = ({
  assignment,
  isOpen,
  onClose,
  onSubmit,
}: GradeAssignmentModalProps) => {
  const [grade, setGrade] = useState(assignment.grade || 0);
  const [feedback, setFeedback] = useState(assignment.feedback || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(assignment.id, grade, feedback, selectedFile || undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Grade Assignment">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-black">Student</label>
          <p className="text-black">{assignment.studentName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Assignment</label>
          <p className="text-black">{assignment.title}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Grade (0-100)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
            className="w-full rounded-lg border border-black/20 px-3 py-1.5 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Graded PDF</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full text-black text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {selectedFile && (
            <p className="mt-1 text-sm text-green-600">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full rounded-lg border border-black/20 px-3 py-1.5 h-24 text-black"
            placeholder="Provide detailed feedback..."
          />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="secondary" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" size="sm">
            Submit Grade
          </Button>
        </div>
      </form>
    </Modal>
  );
};
