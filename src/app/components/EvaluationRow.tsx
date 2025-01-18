'use client';

import { useState, useEffect } from 'react';

interface EvaluationRowProps {
  student: {
    id: string;
    name: string;
    courseId: string;
  };
  onSubmit: (evaluation: {
    studentName: string;
    studentId: string;
    courseId: string;
    review: string;
    grade: string;
    feedback: string;
  }) => void;
  initialSubmission?: {
    review: string;
    grade: string;
    feedback: string;
  };
}

const EvaluationRow = ({ student, onSubmit, initialSubmission }: EvaluationRowProps) => {
  const [isExpanded, setIsExpanded] = useState(!!initialSubmission);
  const [formData, setFormData] = useState({
    review: '',
    grade: '',
    feedback: '',
    file: null as File | null,
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialSubmission) {
      setFormData(prev => ({
        ...prev,
        review: initialSubmission.review,
        grade: initialSubmission.grade,
        feedback: initialSubmission.feedback,
      }));
    }
  }, [initialSubmission]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      studentName: student.name,
      studentId: student.id,
      courseId: student.courseId,
      review: formData.review,
      grade: formData.grade,
      feedback: formData.feedback,
    });
    if (!initialSubmission) {
      setIsExpanded(false);
      setFormData({
        review: '',
        grade: '',
        feedback: '',
        file: null,
      });
    }
  };

  return (
    <div className="border rounded-lg mb-4 overflow-hidden bg-white">
      {/* Header Row */}
      <div className="p-4 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-8">
          <div>
            <h3 className="font-medium text-gray-800">{student.name}</h3>
            <p className="text-sm text-gray-500">ID: {student.id}</p>
          </div>
          <div className="text-purple-600 font-medium">{student.courseId}</div>
        </div>
        {!initialSubmission && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {isExpanded ? 'Close' : 'Evaluate'}
          </button>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Upload PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Review */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Review
              </label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="Enter your review..."
                required
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="">Select Grade</option>
                <option value="Ex">Ex (Excellent)</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="P">P (Pass)</option>
                <option value="F">F (Fail)</option>
              </select>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Feedback
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="Enter feedback for the student..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {initialSubmission ? 'Update Evaluation' : 'Submit Evaluation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EvaluationRow;
