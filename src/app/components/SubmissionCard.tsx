'use client';

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
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {submission.studentName}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>ID: {submission.studentId}</span>
              <span className="text-purple-600 font-medium">
                {submission.courseId}
              </span>
              <span className="text-gray-500">
                Submitted: {submission.submittedDate}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Grade:</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
              {submission.grade}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Review</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
              {submission.review}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
              {submission.feedback}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 transition-colors">
            Download PDF
          </button>
          <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Edit Submission
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
