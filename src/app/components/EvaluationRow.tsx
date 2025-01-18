'use client';

import { useState } from 'react';

interface EvaluationRowProps {
  student: {
    id: string;
    name: string;
    courseId: string;
  };
}

const EvaluationRow = ({ student }: EvaluationRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    review: '',
    grade: '',
    feedback: '',
    file: null as File | null,
  });

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
    // Handle submission logic here
    console.log('Submitting:', formData);
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
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {isExpanded ? 'Close' : 'Evaluate'}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Review */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your review..."
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter feedback for the student..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Submit Evaluation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EvaluationRow;
