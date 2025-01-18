'use client';

import { useState } from 'react';
import { Badge } from '@/app/components/common/Badge';
import { Card } from '@/app/components/common/Card';
import { useRouter } from 'next/navigation';
import { useSubmissionStore } from '@/app/store/submissions';

interface SubmissionCardProps {
  submission: {
    id: string;
    studentName: string;
    studentId: string;
    courseId: string;
    review: string;
    grade: string;
    feedback: string;
    submittedDate: string;
  };
}

const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const updateSubmission = useSubmissionStore((state) => state.updateSubmission);

  // Function to handle PDF download
  const handleDownload = async () => {
    try {
      // In a real application, this would make an API call to get the PDF URL
      const pdfUrl = `/api/submissions/${submission.id}/pdf`;
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `submission-${submission.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again later.');
    }
  };

  // Function to handle edit button click
  const handleEdit = () => {
    // Store the current submission in the store for editing
    updateSubmission({
      ...submission,
      isEditing: true
    });
    // Navigate to the evaluate page with the submission ID
    router.push(`/ta/evaluate?submissionId=${submission.id}`);
  };

  const getBadgeVariant = (grade: string) => {
    switch (grade) {
      case 'Ex':
        return 'purple';
      case 'A':
        return 'green';
      case 'B':
        return 'blue';
      case 'C':
        return 'yellow';
      case 'D':
      case 'F':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Card>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{submission.studentName}</h3>
            <p className="text-sm text-gray-500">ID: {submission.studentId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getBadgeVariant(submission.grade)} size="lg">
              Grade: {submission.grade}
            </Badge>
          </div>
        </div>

        {/* Course and Date */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">Course: {submission.courseId}</p>
          <p className="text-sm text-gray-600">Submitted: {submission.submittedDate}</p>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Review</h4>
              <p className="text-gray-600">{submission.review}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback</h4>
              <p className="text-gray-600">{submission.feedback}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Download PDF
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit Submission
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SubmissionCard;
